package org.happy.insrance.controller;


import lombok.extern.slf4j.Slf4j;
import org.happy.insrance.controller.bean.ChapterDetail;
import org.happy.insrance.controller.bean.ChapterInfo;
import org.happy.insrance.controller.bean.CourseInfo;
import org.happy.insrance.controller.bean.UserDetail;
import org.happy.insrance.service.CourseService;
import org.happy.insrance.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/rest/course")
public class CourseController {

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    @PostMapping("/create")
    public CourseInfo createCourse(@RequestBody CourseInfo courseInfo, @CookieValue String token) throws Exception {
        log.info("Create course event. courseInfo=" + courseInfo + ", token=" + token);
        //查找token对应的用户ID
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //创建并范围课程号
        return courseService.createCourse(courseInfo.getCourseName(), userDetail.getUserId());
    }

    @GetMapping("/info/{courseId}")
    public CourseInfo getCourseInfo(@PathVariable String courseId) throws Exception {
        log.info("Get course event. courseId=" + courseId);
        return this.courseService.getCourseInfo(courseId);
    }

    @PostMapping("/update")
    public void updateCourse(@RequestBody CourseInfo courseInfo, @CookieValue String token) throws Exception {
        log.info("Update course event. courseInfo=" + courseInfo);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //查找权限
        if (this.courseService.isTeacher(userDetail.getUserId(), courseInfo.getCourseId())) {
            this.courseService.updateCourseInfo(courseInfo);
        } else {
            throw new Exception("No authority error.");
        }

    }

    @PostMapping("/cover/upload/{courseId}")
    public String uploadCover(@PathVariable String courseId, @CookieValue String token, @RequestParam("file") MultipartFile image) throws Exception {
        log.info("Upload course cover event. courseId=" + courseId);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //查找权限
        if (this.courseService.isTeacher(userDetail.getUserId(), courseId)) {
            return this.courseService.uploadCourseCover(image.getBytes(), courseId);
        } else {
            throw new Exception("No authority error.");
        }
    }

    @GetMapping("/isTeacher/{courseId}")
    public boolean checkTeacher(@PathVariable String courseId, @CookieValue String token) throws Exception {
        log.info("Check auth event. courseId=" + courseId + ", token=" + token);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //判断权限
        return this.courseService.isTeacher(userDetail.getUserId(), courseId);
    }


    @PostMapping("/chapter/create/{courseId}")
    public ChapterInfo createChapter(@PathVariable String courseId, @CookieValue String token) throws Exception {
        log.info("Create chapter event. courseId=" + courseId + ", token=" + token);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //判断权限，若无权限会抛出异常
        this.courseService.checkEditAuth(courseId, userDetail.getUserId());
        //创建章节
        return this.courseService.createChapter(courseId);
    }

    @GetMapping("/chapter/list/{courseId}")
    public List<ChapterInfo> getChapterList(@PathVariable String courseId, @CookieValue String token) throws Exception {
        log.info("Get chapter list event. courseId=" + courseId);
        //若没有登录，会抛出异常
        this.userService.getUserDetailByToken(token);
        
        return this.courseService.getChapterList(courseId);
    }

    @PostMapping("/chapter/delete/{courseId}/{chapterId}")
    public ChapterInfo deleteChapter(@PathVariable String courseId, @PathVariable String chapterId, @CookieValue String token) throws Exception {
        log.info("Delete chapter event. courseId=" + courseId + ", token=" + token + ", chapter=" + chapterId);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //判断权限，若无权限会抛出异常
        this.courseService.checkEditAuth(courseId, userDetail.getUserId());
        //删除章节
        return this.courseService.deleteChapter(courseId, chapterId);
    }

    @GetMapping("/chapter/{courseId}/{chapterId}")
    public ChapterDetail getChapterDetail(@PathVariable String courseId, @PathVariable String chapterId, @CookieValue String token) throws Exception {
        log.info("Get chapter detail event. courseId=" + courseId + ", token=" + token + ", chapter=" + chapterId);
        //获取token对应的用户，只有权限的人才能看
        this.userService.getUserDetailByToken(token);
        //查询课程内容
        return this.courseService.getChapterDetail(courseId, chapterId);
    }

    @PostMapping("/chapter/{courseId}/{chapterId}")
    public void saveChapterDetail(@PathVariable String courseId, @PathVariable String chapterId,
                                  @CookieValue String token, @RequestBody ChapterDetail chapterDetail) throws Exception {
        log.info("Save chapter event. courseId=" + courseId + ", token=" + token + ", chapter=" + chapterId);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        //判断权限，若无权限会抛出异常
        this.courseService.checkEditAuth(courseId, userDetail.getUserId());
        //保存
        this.courseService.saveChapterDetail(courseId, chapterDetail);
    }

    @GetMapping("/list/all")
    public List<CourseInfo> listAllCourses() throws Exception {
        return this.courseService.listAllCourses();
    }

    @PostMapping("/follow/{courseId}")
    public void followCourse(@PathVariable String courseId, @CookieValue String token) throws Exception {
        log.info("follow course event. courseId=" + courseId + ", token=" + token);
        //获取token对应的用户
        UserDetail userDetail = this.userService.getUserDetailByToken(token);
        this.courseService.followCourse(courseId, userDetail.getUserId());
    }


//    /**
//     * 查询访问权限，包括作者，读者以及访客
//     * @param token
//     * @param courseId
//     * @return
//     * @throws Exception
//     */
//    @GetMapping("/isTeacher/{courseId}")
//    public String checkAccessMode(@CookieValue String token, @PathVariable String courseId) throws Exception{
//
//    }
}
