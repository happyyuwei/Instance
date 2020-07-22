package org.happy.insrance.controller.bean;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseInfo {

    private String courseName;

    private String teacherId;

    private String teacherName;

    //教师头像
    private String teacherAvatar;

    private String courseId;

    private String courseAbstract;

    private String courseCover;

    private String courseContent;

    private long createTime;

    private long updateTime;
}
