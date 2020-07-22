package org.happy.insrance.service;

import org.happy.insrance.controller.bean.ChapterDetail;
import org.happy.insrance.controller.bean.ChapterInfo;
import org.happy.insrance.controller.bean.CourseInfo;

import java.util.List;

public interface CourseService {

    /**
     * 输出课程名创建课程名
     *
     * @param courseName
     * @throws Exception
     */
    public CourseInfo createCourse(String courseName, String teacherId) throws Exception;

    public CourseInfo getCourseInfo(String courseId) throws Exception;

    public void updateCourseInfo(CourseInfo courseInfo) throws Exception;

    /**
     * @since 2020.7.15
     * 新增返回 上传后的image id
     * @param bytes
     * @param courseId
     * @return
     * @throws Exception
     */
    public String uploadCourseCover(byte[] bytes, String courseId) throws Exception;

    @Deprecated
    public boolean isTeacher(String userId, String courseId) throws Exception;

    public void checkEditAuth(String courseId, String userId) throws Exception;

    /**
     * 创建章节
     *
     * @param courseId
     * @return 章节号
     * @throws Exception
     */
    public ChapterInfo createChapter(String courseId) throws Exception;

    /**
     * 删除章节
     *
     * @param courseId
     * @param chapterId
     * @throws Exception
     */
    public ChapterInfo deleteChapter(String courseId, String chapterId) throws Exception;


    /**
     * @param courseId
     * @return
     * @throws Exception
     */
    public List<ChapterInfo> getChapterList(String courseId) throws Exception;

    /**
     * @param courseId
     * @return
     * @throws Exception
     */
    public ChapterDetail getChapterDetail(String courseId, String chapterId) throws Exception;


    /**
     * 保存章节
     *
     * @param courseId
     * @param chapterDetail
     * @throws Exception
     */
    public void saveChapterDetail(String courseId, ChapterDetail chapterDetail) throws Exception;

    /**
     * 列举所有课程
     *
     * @return
     * @throws Exception
     */
    public List<CourseInfo> listAllCourses() throws Exception;


    /**
     * 关注课程
     *
     * @param courseId
     * @param userId
     * @throws Exception
     */
    public void followCourse(String courseId, String userId) throws Exception;

    /**
     * 取消关注
     * @param courseId
     * @param userId
     * @throws Exception
     */
    public void cancelFollowCourse(String courseId, String userId) throws Exception;

}
