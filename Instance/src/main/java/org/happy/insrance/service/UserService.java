package org.happy.insrance.service;

import org.happy.insrance.controller.bean.UserDetail;
import org.happy.insrance.exception.UserServiceException;

public interface UserService {


    /**
     *
     * @param userName 用户名
     * @param password 密码
     * @return 令牌，放入cookie
     * @throws Exception 登录异常
     */
    public String login(String userName, String password) throws Exception;

    /**
     * 退出登录
     * @param token
     * @return
     * @throws Exception
     */
    public void logout(String token) throws Exception;

    /**
     * 根据token查找用户信息
     * @param token
     * @return
     */
    public UserDetail getUserDetailByToken(String token) throws Exception;

}
