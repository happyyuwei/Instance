package org.happy.insrance.service.impl;

import org.happy.insrance.controller.bean.ChapterDetail;
import org.happy.insrance.controller.bean.ChapterInfo;
import org.happy.insrance.controller.bean.CourseInfo;
import org.happy.insrance.controller.bean.PartDetail;
import org.happy.insrance.dao.UserRepository;
import org.happy.insrance.dao.bean.ChapterDAO;
import org.happy.insrance.dao.bean.CourseDAO;
import org.happy.insrance.dao.CourseRepository;
import org.happy.insrance.dao.bean.PartDAO;
import org.happy.insrance.dao.bean.UserDAO;
import org.happy.insrance.service.CourseService;
import org.happy.insrance.service.StaticResourceService;
import org.happy.insrance.util.RandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class CourseServiceImpl implements CourseService {

    //初始化默认封面值
    private String defaultCover = "cover_000000.jpg";

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StaticResourceService staticResourceService;

    @Autowired
    private UserRepository userRepository;

    /**
     * 创建课程
     *
     * @param courseName
     * @param teacherId
     * @return
     * @throws Exception
     */
    @Override
    public CourseInfo createCourse(String courseName, String teacherId) throws Exception {

        //生成课程ID
        String courseId = RandomUtil.generateRandomId("course_", "");

        //创建课程
        CourseDAO courseDAO = CourseDAO.builder()
                .courseName(courseName)
                .courseId(courseId)
                .teacherId(teacherId)
                .courseCover(this.defaultCover)
                .createTime(System.currentTimeMillis())
                .updateTime(System.currentTimeMillis())
                .build();

        //寻找用户表
        UserDAO userDAO = this.userRepository.findByUserId(teacherId);
        //更新用户信息
        List<String> teachingList = userDAO.getTeachingList();
        if (teachingList == null) {
            teachingList = new ArrayList<>();
            userDAO.setTeachingList(teachingList);
        }
        teachingList.add(courseId);
        this.userRepository.saveUser(userDAO);

        //持久化
        this.courseRepository.saveCourse(courseDAO);

        return CourseInfo.builder()
                .courseName(courseName)
                .courseId(courseId)
                .teacherId(teacherId)
                .createTime(courseDAO.getCreateTime())
                .updateTime(courseDAO.getUpdateTime())
                .build();
    }

    /**
     * 查看该用户是否有权限编辑该课程
     *
     * @param userId
     * @param courseId
     * @return
     */
    @Override
    public boolean isTeacher(String userId, String courseId) throws Exception {
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        if (courseDAO != null) {
            return courseDAO.getTeacherId().equals(userId);
        } else {
            throw new Exception("Course not found error.");
        }
    }

    @Override
    public CourseInfo getCourseInfo(String courseId) throws Exception {
        //查询课程信息
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        if (courseDAO == null) {
            throw new Exception("Course not exist.");
        }

        //获取教师昵称
        UserDAO userDAO = this.userRepository.findByUserId(courseDAO.getTeacherId());

        //封装
        return CourseInfo.builder()
                .courseId(courseDAO.getCourseId())
                .courseName(courseDAO.getCourseName())
                .courseAbstract(courseDAO.getCourseAbstract())
                .courseContent(courseDAO.getCourseContent())
                .courseCover(courseDAO.getCourseCover())
                .teacherId(courseDAO.getTeacherId())
                .createTime(courseDAO.getCreateTime())
                .updateTime(courseDAO.getUpdateTime())
                .teacherName(userDAO.getUserName())
                .build();
    }

    /**
     * 只能更新：摘要，课程内容
     *
     * @param courseInfo
     * @throws Exception
     */
    @Override
    public void updateCourseInfo(CourseInfo courseInfo) throws Exception {
        //首先查询是否该课程存在，若不存在，则无法更新
        CourseDAO courseDAO = this.courseRepository.findById(courseInfo.getCourseId());
        if (courseDAO == null) {
            throw new Exception("Course not exist.");
        }
        //若存在，则更新
        CourseDAO updatedCourseDAO = CourseDAO.builder()
                //使用上传的id查询
                .courseId(courseInfo.getCourseId())
                //名字无法更新
                .courseName(courseDAO.getCourseName())
                .createTime(courseDAO.getCreateTime())
                .teacherId(courseDAO.getTeacherId())
                .updateTime(System.currentTimeMillis())
                //更新摘要
                .courseAbstract(courseInfo.getCourseAbstract())
                //更新内容
                .courseContent(courseInfo.getCourseContent())
                .courseCover(courseDAO.getCourseCover())
                .chapterList(courseDAO.getChapterList())
                .build();

        this.courseRepository.saveCourse(updatedCourseDAO);
    }

    /**
     * 更新课程封面
     *
     * @param bytes
     * @param courseId
     * @throws Exception
     */
    @Override
    public String uploadCourseCover(byte[] bytes, String courseId) throws Exception {
        //获取用户信息
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        //生成文件号
        String coverId = RandomUtil.generateRandomId("cover_", ".jpg");
        //保存
        this.staticResourceService.saveImage(bytes, coverId);
        //保存新的封面号
        courseDAO.setCourseCover(coverId);
        //创建章节需要更新课程更新时间
        courseDAO.setUpdateTime(System.currentTimeMillis());
        this.courseRepository.saveCourse(courseDAO);
        return coverId;
    }

    /**
     * 查询是否有编辑权限，如果有则无返回，如果无权限则抛出异常
     *
     * @param courseId
     * @param userId
     * @throws Exception
     */
    @Override
    public void checkEditAuth(String courseId, String userId) throws Exception {
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        if (courseDAO != null) {
            if (!courseDAO.getTeacherId().equals(userId)) {
                throw new Exception("No authority error.");
            }
        } else {
            throw new Exception("Course not found error.");
        }
    }

    @Override
    public ChapterInfo createChapter(String courseId) throws Exception {

        //获取课程对象
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        //create chapter id
        String chapterId = RandomUtil.generateRandomId("chapter_", "");
        //创建章节对象
        ChapterDAO chapterDAO = ChapterDAO.builder()
                .chapterId(chapterId)
                .createTime(System.currentTimeMillis())
                .updateTime(System.currentTimeMillis())
                .build();

        //创建章节需要更新课程更新时间
        courseDAO.setUpdateTime(System.currentTimeMillis());

        //添加至课程
        //章节列表一开始是空表，不会出现null的情况
        courseDAO.getChapterList().add(chapterDAO);
        //持久化
        this.courseRepository.saveCourse(courseDAO);

        //创建返回对象
        return ChapterInfo.builder()
                .chapterNumber(courseDAO.getChapterList().size())
                .chapterId(chapterId)
                .build();
    }

    @Override
    public List<ChapterInfo> getChapterList(String courseId) throws Exception {
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        List<ChapterDAO> chapterDAOList = courseDAO.getChapterList();
        List<ChapterInfo> chapterInfoList = new ArrayList<>();
        for (int i = 0; i < chapterDAOList.size(); i++) {
            ChapterDAO chapterDAO = chapterDAOList.get(i);
            chapterInfoList.add(ChapterInfo
                    .builder()
                    .chapterName(chapterDAO.getChapterName())
                    .chapterId(chapterDAO.getChapterId())
                    //课时号从1开始
                    .chapterNumber(i + 1)
                    .build());
        }
        return chapterInfoList;
    }

    /**
     * 删除章节
     *
     * @param courseId
     * @param chapterId
     * @return
     * @throws Exception
     */
    @Override
    public ChapterInfo deleteChapter(String courseId, String chapterId) throws Exception {
        //查询课程
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        List<ChapterDAO> chapterDAOList = courseDAO.getChapterList();
        //查询章节号
        int chapterNumber = this.getChapterNumber(chapterDAOList, chapterId);
        //index=章节号-1
        ChapterDAO deletedChapterDAO = chapterDAOList.remove(chapterNumber - 1);
        //删除章节会需要更新课程更新时间
        courseDAO.setUpdateTime(System.currentTimeMillis());
        //持久化
        this.courseRepository.saveCourse(courseDAO);
        //创建返回结果
        return ChapterInfo.builder()
                .chapterId(deletedChapterDAO.getChapterId())
                .chapterNumber(chapterNumber)
                .chapterName(deletedChapterDAO.getChapterName())
                .build();
    }


    /**
     * 获取某一张的全部信息
     *
     * @param courseId
     * @param chapterId
     * @return
     * @throws Exception
     */
    @Override
    public ChapterDetail getChapterDetail(String courseId, String chapterId) throws Exception {
        //查询章节列表
        List<ChapterDAO> chapterDAOList = this.courseRepository.findById(courseId).getChapterList();
        int chapterNumber = this.getChapterNumber(chapterDAOList, chapterId);
        //index=章节号-1
        ChapterDAO chapterDAO = chapterDAOList.get(chapterNumber - 1);

        //转换格式
        List<PartDetail> partDetailList = new ArrayList<>();
        for (PartDAO partDAO : chapterDAO.getPartList()) {
            partDetailList.add(PartDetail.builder()
                    .partName(partDAO.getPartName())
                    .contentHTML(partDAO.getContentHTML())
                    .build());
        }
        return ChapterDetail.builder()
                .chapterId(chapterDAO.getChapterId())
                .chapterName(chapterDAO.getChapterName())
                .chapterNumber(chapterNumber)
                .partList(partDetailList)
                .createTime(chapterDAO.getCreateTime())
                .updateTime(chapterDAO.getUpdateTime())
                .build();
    }


    /**
     * 保存
     *
     * @param courseId
     * @param chapterDetail
     * @throws Exception
     */
    @Override
    public void saveChapterDetail(String courseId, ChapterDetail chapterDetail) throws Exception {
        CourseDAO courseDAO = this.courseRepository.findById(courseId);
        //查询章节列表
        List<ChapterDAO> chapterDAOList = courseDAO.getChapterList();
        int chapterNumber = this.getChapterNumber(chapterDAOList, chapterDetail.getChapterId());
        //index=章节号-1
        ChapterDAO oldChapterDAO = chapterDAOList.get(chapterNumber - 1);
        //生成chapter dao
        List<PartDAO> partDAOList = new ArrayList<>();
        for (PartDetail partDetail : chapterDetail.getPartList()) {
            partDAOList.add(PartDAO.builder()
                    .partName(partDetail.getPartName())
                    .contentHTML(partDetail.getContentHTML())
                    .build()
            );
        }
        ChapterDAO updatedChapterDAO = ChapterDAO.builder()
                .updateTime(System.currentTimeMillis())
                .createTime(oldChapterDAO.getCreateTime())
                .chapterId(chapterDetail.getChapterId())
                .chapterName(chapterDetail.getChapterName())
                .partList(partDAOList)
                .build();
        chapterDAOList.set(chapterNumber - 1, updatedChapterDAO);
        //更新时间
        courseDAO.setUpdateTime(System.currentTimeMillis());
        //持久化
        this.courseRepository.saveCourse(courseDAO);
    }

    /**
     * 列举所有课程
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<CourseInfo> listAllCourses() throws Exception {
        List<CourseDAO> courseDAOList = this.courseRepository.findAll();
        List<CourseInfo> courseInfoList = new ArrayList<>();
        for (CourseDAO courseDAO : courseDAOList) {
            UserDAO userDAO = this.userRepository.findByUserId(courseDAO.getTeacherId());
            courseInfoList.add(CourseInfo.builder()
                    .updateTime(courseDAO.getUpdateTime())
                    .createTime(courseDAO.getCreateTime())
                    .courseId(courseDAO.getCourseId())
                    .courseName(courseDAO.getCourseName())
                    .teacherId(courseDAO.getTeacherId())
                    .courseAbstract(courseDAO.getCourseAbstract())
                    .courseContent(courseDAO.getCourseContent())
                    .courseCover(courseDAO.getCourseCover())
                    .teacherName(userDAO.getUserName())
                    .teacherAvatar(userDAO.getAvatar())
                    .build());
        }
        return courseInfoList;
    }

    /**
     * 关注课程
     * @param courseId
     * @param userId
     * @throws Exception
     */
    @Override
    public void followCourse(String courseId, String userId) throws Exception {
        //查询课程是否存在
        this.courseRepository.findById(courseId);
        //查询用户
        UserDAO userDAO = this.userRepository.findByUserId(userId);
        List<String> learningList = userDAO.getLearningList();
        //兼容旧系统learning list可能为空的情况
        if (learningList == null) {
            learningList = new ArrayList<>();
        }
        //只可以关注没有关注过的课程
        int index=learningList.indexOf(courseId);
        if(index<0) {
            learningList.add(courseId);
            userDAO.setLearningList(learningList);
            //持久化
            this.userRepository.saveUser(userDAO);
        }else{
            throw new Exception("course has already been followed before.");
        }
    }

    @Override
    public void cancelFollowCourse(String courseId, String userId) throws Exception {
        UserDAO userDAO = this.userRepository.findByUserId(userId);
        List<String> learningList = userDAO.getLearningList();
        //兼容旧系统learning list可能为空的情况
        if (learningList == null) {
            learningList = new ArrayList<>();
        }
        //只能取消已关注的课程
        int index=learningList.indexOf(courseId);
        if(index>=0) {
            learningList.remove(index);
            userDAO.setLearningList(learningList);
            //持久化
            this.userRepository.saveUser(userDAO);
        }else{
            throw new Exception("course has already been followed before.");
        }
    }

    /**
     * 根据 chpaterId 查询 课程号
     *
     * @param chapterDAOList
     * @param chapterId
     * @return
     */
    private int getChapterNumber(List<ChapterDAO> chapterDAOList, String chapterId) throws Exception {
        for (int i = 0; i < chapterDAOList.size(); i++) {
            if (chapterDAOList.get(i).getChapterId().equals(chapterId)) {
                // 章节号=index+1
                return i + 1;
            }
        }
        throw new Exception("Chapter ID not found.");
    }
}
