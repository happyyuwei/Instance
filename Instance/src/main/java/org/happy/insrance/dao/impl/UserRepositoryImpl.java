package org.happy.insrance.dao.impl;

import org.happy.insrance.dao.bean.UserDAO;
import org.happy.insrance.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepository {

    final private String userCollection = "users";

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<UserDAO> findByField(String field, String value) {
        return mongoTemplate.find(Query.query(Criteria.where(field).is(value)), UserDAO.class, userCollection);
    }

    @Override
    public UserDAO findFirstByField(String field, String value) {
        List<UserDAO> userDAOList = this.findByField(field, value);

        if (userDAOList.size() == 0) {
            return null;
        } else {
            return userDAOList.get(0);
        }


    }

    @Override
    public void saveUser(UserDAO userDAO) {
        mongoTemplate.save(userDAO, this.userCollection);
    }


    @Override
    public UserDAO findByUserId(String userId) {
        return this.mongoTemplate.findById(userId, UserDAO.class, this.userCollection);
    }

    @Override
    public List<UserDAO> findAllUsers() {
        return this.mongoTemplate.findAll(UserDAO.class, this.userCollection);
    }
}
