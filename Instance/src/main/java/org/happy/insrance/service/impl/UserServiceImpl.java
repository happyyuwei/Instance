package org.happy.insrance.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.happy.insrance.controller.bean.UserDetail;
import org.happy.insrance.dao.bean.TokenDAO;
import org.happy.insrance.dao.bean.UserDAO;
import org.happy.insrance.dao.UserRepository;
import org.happy.insrance.service.UserService;
import org.happy.insrance.util.RandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    //当前设定七天免登录
    final private long sevenDays=7*24*60*60*1000;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String login(String userName, String password) throws Exception {
        List<UserDAO> userDAOList = userRepository.findByField("userName",userName);

        //用户不存在
        if(userDAOList.size()==0){
            throw new Exception("User not exist.");
        }

        //user name不可以重复,列表里只有一个
        UserDAO userDAO=userDAOList.get(0);

        //核对密码
        if(userDAO.getPassword().equals(password)){
            //生成的令牌无前缀与后缀
            String tokenId= RandomUtil.generateRandomId("","");
            //获取token 列表
            List<TokenDAO> tokenDAOList=userDAO.getTokenDAOList();
            //和旧系统字段兼容
            if(tokenDAOList==null){
                tokenDAOList=new ArrayList<>();
            }
            //添加新token
            tokenDAOList.add(TokenDAO.builder()
                    .tokenId(tokenId)
                    //七天内免登录
                    .expireDate(System.currentTimeMillis()+this.sevenDays)
                    .build());

            //将令牌进行保存
            userDAO.setTokenDAOList(tokenDAOList);
            //持久化
            this.userRepository.saveUser(userDAO);
            log.info("New token saved. token="+tokenId);
            return tokenId;
        }else{
            throw new Exception("User password error.");
        }
    }

    @Override
    public UserDetail getUserDetailByToken(String token) throws Exception{
        List<UserDAO> userDAOList=this.userRepository.findAllUsers();
        for(UserDAO userDAO:userDAOList){
            List<TokenDAO> tokenDAOList=userDAO.getTokenDAOList();
            for(TokenDAO tokenDAO:tokenDAOList){
                //匹配token
                if(tokenDAO.getTokenId().equals(token)){
                    //新增查询过期日期
                    //@since 2020.7.15
                    if(tokenDAO.getExpireDate()>System.currentTimeMillis()){
                        return UserDetail.builder()
                                .avatar(userDAO.avatar)
                                .learningList(userDAO.learningList)
                                .teachingList(userDAO.teachingList)
                                .userId(userDAO.userId)
                                .userName(userDAO.userName)
                                .build();
                    }else{
                        throw new Exception("Token expired.");
                    }
                }
            }
        }
        throw new Exception("Token not legal.");
    }

    @Override
    public void logout(String token) throws Exception {
        //寻找用户
        List<UserDAO> userDAOList=this.userRepository.findAllUsers();
        for(UserDAO userDAO:userDAOList){
            List<TokenDAO> tokenDAOList=userDAO.getTokenDAOList();
            //移除token
            tokenDAOList.removeIf(tokenDAO -> tokenDAO.getTokenId().equals(token));
            //保存
            this.userRepository.saveUser(userDAO);
            //由于token唯一，不用继续找
            return;
        }
        throw new Exception("Token not legal.");
    }
}
