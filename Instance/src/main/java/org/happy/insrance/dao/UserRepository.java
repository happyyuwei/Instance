package org.happy.insrance.dao;

import org.happy.insrance.dao.bean.UserDAO;

import java.util.List;

public interface UserRepository {

    /**
     * 寻找满足字段field=value的用户
     * @param field
     * @param value
     * @return
     */
    public List<UserDAO> findByField(String field, String value);

    /**
     * 寻找第一个
     * @param field
     * @param value
     * @return
     */
    public UserDAO findFirstByField(String field, String value);


    /**
     * 通过用户ID查找
     * @param userId
     * @return
     */
    public UserDAO findByUserId(String userId);

    /**
     * 保存用户，如果用户ID存在，则覆盖之前的记录
     * @param userDAO
     */
    public void saveUser(UserDAO userDAO);


    /**
     * 发现所有用户
     * @return
     */
    public List<UserDAO> findAllUsers();
}
