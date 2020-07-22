package org.happy.insrance;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.junit.jupiter.api.Test;


@SpringBootTest
public class MongoConnectTest {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    public void contextLoads() {
//        User user = new User();
//        user.setId("50AB");
//        user.setName("哈哈");
//        user.setSex("男");
//        user.setAge(10);
//        user.setMoney(1.2);

//        mongoTemplate.save(user);

//        mongoTemplate.insert(user);

//        user.setId("100CD");
//        user.setName("李红");
//        user.setSex("女");
//        user.setAge(10);
//        mongoTemplate.insert(user);
//        System.out.println(mongoTemplate.findAll(User.class));

    }
}
