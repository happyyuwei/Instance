/**
 * 将所有restful相关的业务查询与UI渲染分离
 * @since 2020.7.15
 * @author yuwei
 */

//加载axios做ajax传输
import axios from "axios"
import { Url } from "./url"


/**
    * 返回结果对象，用于设置回调
    */
class Result {
    constructor() {
        this.runThen = (response) => { };
        this.runCatch = (error) => { }
    }

    //setter
    then = (thenFunc) => {
        this.runThen = thenFunc;
        return this;
    }

    //setter
    catch = (catchFunc) => {
        this.runCatch = catchFunc;
        return this;
    }

    //request
    request = (axiosRequest) => {
        axiosRequest.then(response => {
            this.runThen(response);
        }).catch(error => {
            this.runCatch(error);
        });
    }
}

/**
   * 查询所有课程
   */
const getCourseListService = () => {

    //创建结果集
    const result = new Result();

    //调用ajax
    result.request(axios.get(Url.courseList))

    //返回回调设置
    return result;
}

/**
 * 关注课程
 * @param {*} courseId 
 */
const followCourseService = (courseId) => {
    const result = new Result();
    result.request(axios.post(Url.courseFollow + courseId));
    return result;
}

/**
 * 获取自己的用户信息
 */
const getUserService = () => {
    const result = new Result();
    result.request(axios.get(Url.userDetail));
    return result;
}

/**
 * 获取教授课程表
 */
const getTeachingListService = () => {
    const result = new Result();
    result.request(axios.get(Url.teachingList));
    return result;
}

/**
 * 获取学习课程表
 */
const getLearningListService = () => {
    const result = new Result();
    result.request(axios.get(Url.learningList));
    return result;
}

/**
 * 创建课程
 */
const createCourseService = (courseName) => {

    const requestBody = {
        courseName: courseName
    }
    const result = new Result();
    result.request(axios.post(Url.createCourse, requestBody));
    return result;
}

/**
 * 获取所有章节服务
 * @param {*} courseId 
 */
const getAllChapterService = (courseId) => {
    const result = new Result();
    result.request(axios.get(Url.chapterList + courseId));
    return result;
}

/**
 * 创建章节
 * @param {*} courseId 
 */
const createChapterService = (courseId) => {

    const result = new Result();
    result.request(axios.post(Url.chapterCreate + courseId));
    return result;
}

/**
 * 删除章节
 * @param {*} courseId 
 * @param {*} chapterId 
 */
const deleteChapterService = (courseId, chapterId) => {
    const result = new Result();
    result.request(axios.post(Url.chapterDelete + courseId + "/" + chapterId));
    return result;
}

/**
 * 获取课程信息
 * @param {*} courseId 
 */
const getCourseInfoService = (courseId) => {
    const result = new Result();
    result.request(axios.get(Url.courseInfo + courseId));
    return result;
}

/**
 * 上传课程信息
 * @param {*} courseId 
 * @param {*} courseName 
 * @param {*} courseAbstract 
 * @param {*} courseContent 
 */
const uploadCourseInfoService = (courseId, courseName, courseAbstract, courseContent) => {
    //整理所有状态
    const course = {
        "courseId": courseId,
        "courseName": courseName,
        "courseAbstract": courseAbstract,
        "courseContent": courseContent
    }
    const result = new Result();
    result.request(axios.post(Url.courseUpdate, course));
    return result;
}


/**
 * 获取章节内容
 * @param {} courseId 
 * @param {*} chapterId 
 */
const getChapterDetailService = (courseId, chapterId) => {
    const result = new Result();
    result.request(axios.get(Url.chapterDetail + courseId + "/" + chapterId));
    return result;
}

/**
 * 保存章节信息
 * @param {*} courseId 
 * @param {*} chapterName 
 * @param {*} chapterId 
 * @param {*} partList 
 */
const saveChapterService = (courseId, chapterName, chapterId, partList) => {
    const chapter = {
        chapterName: chapterName,
        chapterId: chapterId,
        //章节序号可有可无
        partList: partList
    }
    const result = new Result();
    result.request(axios.post(Url.chapterSave + courseId + "/" + chapterId, chapter));
    return result;
}


/**
 * 退出登录
 */
const logoutService=()=>{
    const result=new Result();
    result.request(axios.post(Url.logout));
    return result;
}

export {
    getCourseListService, followCourseService, getUserService,
    getTeachingListService, getLearningListService,
    createCourseService, getAllChapterService, createChapterService, deleteChapterService,
    getCourseInfoService, uploadCourseInfoService, getChapterDetailService, saveChapterService,
    logoutService
}
