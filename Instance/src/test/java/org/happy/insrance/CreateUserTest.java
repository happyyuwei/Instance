package org.happy.insrance;


import org.happy.insrance.dao.bean.UserDAO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;


@SpringBootTest
public class CreateUserTest {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    public void contextLoads() {

        UserDAO userDAO1=UserDAO.builder()
                .userId("user_13579")
                .userName("小红")
                .password("xiaohong")
                .avatar("avatar_1088931711.jpg")
                .build();

        UserDAO userDAO2=UserDAO.builder()
                .userId("user_24680")
                .userName("小灰")
                .password("xiaohui")
                .avatar("avatar_6536086.jpg")
                .build();


        mongoTemplate.save(userDAO1, "users");
        mongoTemplate.save(userDAO2, "users");
//        List<UserDAO> userDAO=mongoTemplate.find(Query.query(Criteria.where("_id").is("user_13579")), UserDAO.class, "users");
        System.out.println(mongoTemplate.findById("user_13579", UserDAO.class, "users"));
//        mongoTemplate.findAll(User.class);
    }
}
