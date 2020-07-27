package org.happy.insrance;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class AppConfig {

    public @Bean MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "grey-dev");
    }

    /*
     * Use the standard Mongo driver API to create a com.mongodb.client.MongoClient instance.
     */
    public @Bean MongoClient mongoClient() {
        //我完全不知道为什么使用dbowner用户使用该链接完全无法访问该数据库，但是改成root就可以
        return MongoClients.create("mongodb://root:****@192.168.1.1:27017/");
    }
}
