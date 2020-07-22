package org.happy.insrance.dao.impl;

import org.happy.insrance.dao.bean.CourseDAO;
import org.happy.insrance.dao.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class CourseRepositoryImpl implements CourseRepository {

    final private String coursesCollection = "courses";

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void saveCourse(CourseDAO courseDAO) {
        mongoTemplate.save(courseDAO, this.coursesCollection);
    }

    @Override
    public CourseDAO findById(String id) throws Exception{
        CourseDAO courseDAO= mongoTemplate.findById(id, CourseDAO.class, this.coursesCollection);
        if(courseDAO==null){
            throw new Exception("Course not found.");
        }
        return courseDAO;
    }

    @Override
    public List<CourseDAO> findAll() throws Exception {
        return this.mongoTemplate.findAll(CourseDAO.class, this.coursesCollection);
    }
}
