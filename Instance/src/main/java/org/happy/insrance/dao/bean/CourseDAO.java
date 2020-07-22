package org.happy.insrance.dao.bean;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Builder
@Data
public class CourseDAO {

    @Id
    private String courseId;

    private String courseName;

    private String teacherId;

    private String courseAbstract;

    private String courseCover;

    private String courseContent;

    private long createTime;

    private long updateTime;

    @Builder.Default
    private List<ChapterDAO> chapterList=new ArrayList<>();

}
