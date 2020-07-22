package org.happy.insrance.dao;


import org.happy.insrance.dao.bean.CourseDAO;

import java.util.List;

public interface CourseRepository {

    public void saveCourse(CourseDAO courseDAO) throws Exception;

    public CourseDAO findById(String id) throws Exception;

    public List<CourseDAO> findAll() throws Exception;

}
