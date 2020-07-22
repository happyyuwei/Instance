package org.happy.insrance.controller;


import lombok.extern.slf4j.Slf4j;
import org.happy.insrance.controller.bean.CourseInfo;
import org.happy.insrance.controller.bean.UserDetail;
import org.happy.insrance.controller.bean.UserLoginInfo;
import org.happy.insrance.service.CourseService;
import org.happy.insrance.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/rest/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private CourseService courseService;

    @PostMapping(value = "/login")
    public void login(@RequestBody UserLoginInfo userLoginInfo, HttpServletResponse response) throws Exception{
        log.info("Login request. User="+userLoginInfo);
        //获取令牌
        String token=userService.login(userLoginInfo.getUserName(), userLoginInfo.getPassword());
        //放入cookie
        Cookie cookie=new Cookie("token",token);
        //设置只有HTTP允许访问
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        //设置免登录时间为7天
        cookie.setMaxAge(60*60*24*7);
        response.addCookie(cookie);
    }

    @PostMapping(value = "/logout")
    public void logout(@CookieValue String token, HttpServletResponse response) throws Exception{
        log.info("Logout request. Token="+token);
        this.userService.logout(token);
        //移除cookie
        Cookie cookie=new Cookie("token",token);
        //设置只有HTTP允许访问
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        //设置免登录时间为7天
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    @GetMapping(value = "/detail")
    public UserDetail getUserDetail(@CookieValue String token) throws Exception{
        log.info("User detail request. token="+token);
        return this.userService.getUserDetailByToken(token);
    }


    @GetMapping("/teaching/list")
    public List<CourseInfo> getTeachingCourseInfoList(@CookieValue String token) throws Exception{
        log.info("Teaching list request. token="+token);
        //获取开设课程
        List<String> teachingList=this.userService.getUserDetailByToken(token).getTeachingList();
        List<CourseInfo> courseInfoList=new ArrayList<>();
        //查询课程信息
        for(String courseId: teachingList){
            courseInfoList.add(courseService.getCourseInfo(courseId));
        }
        return courseInfoList;
    }

    @GetMapping("/learning/list")
    public List<CourseInfo> getLearningCourseInfoList(@CookieValue String token) throws Exception{
        log.info("Learning course list request. token="+token);
        //获取开设课程
        List<String> learningList=this.userService.getUserDetailByToken(token).getLearningList();
        List<CourseInfo> courseInfoList=new ArrayList<>();
        //查询课程信息
        for(String courseId: learningList){
            courseInfoList.add(courseService.getCourseInfo(courseId));
        }
        return courseInfoList;
    }
}
