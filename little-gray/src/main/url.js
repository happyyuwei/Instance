const Url = {
    //rest请求URL
    //登录
    login: "/rest/user/login/",
    //查询用户信息
    userDetail: "/rest/user/detail/",
    //创建课程
    createCourse: "/rest/course/create/",
    //查询课程编辑权限
    isTeacher: "/rest/course/isTeacher/",
    //查询课程信息
    courseInfo: "/rest/course/info/",
    //更新课程信息
    courseUpdate: "/rest/course/update/",
    //上传封面
    uploadCover: "/rest/course/cover/upload/",
    //查询创建课程详细信息
    teachingList: "/rest/user/teaching/list/",
    //查询学习课程详细信息
    learningList: "/rest/user/learning/list/",
    //查询所有章节
    chapterList: "/rest/course/chapter/list/",
    //创建章节
    chapterCreate: "/rest/course/chapter/create/",
    //删除章节
    chapterDelete: "/rest/course/chapter/delete/",
    //查询章节详情, get
    chapterDetail: "/rest/course/chapter/",
    //保存章节详情, post
    chapterSave: "/rest/course/chapter/",
    //查询所有课程
    courseList: "/rest/course/list/all/",
    //关注课程
    courseFollow: "/rest/course/follow/",
    //图像上传
    imageUpload: "/rest/static/img/upload/",
    //图像查询
    imageDownload: "/rest/static/img/",
    //退出登录
    logout: "/rest/user/logout/",

    //前端页面路由
    page: {
        //主页,和/public 路由位置一致
        home: "/",
        //登录页
        login: "/login",
        //个人空间
        room: "/room",
        //大厅页
        public: "/public",
        //教室页,:courseId为模式匹配参数，需要填入具体课程号， URL后缀可继续跟进，因此路由不可以添加 exact参数
        classroom: "/classroom/:courseId/:chapterId",
        //课程介绍页，其chapterId无意义，使用0填充
        introduction: "/classroom/:courseId/0/intro",
        //课程内容页，:courseId为模式匹配参数，需要填入具体的章节号
        chapter: "/classroom/:courseId/:chapterId/learn",
        //尚未登录页面
        notLogin: "/error/unregister",
        //无法加载课程
        courseCrack:"/error/course/crack",
    }
}


const getIntroductionURL = (courseId) => {
    return Url.page.introduction.replace(":courseId", courseId);
}

const getChapterURL = (courseId, chapter) => {
    return Url.page.chapter.replace(":courseId", courseId).replace(":chapterId", chapter);
}


/**
 * 获取css 中 background 图像的url
 * @param {*} imageId 
 */
const getBackgroundImageURL = (imageId) => {
    return "url(" + Url.imageDownload + imageId + ")";
}

/**
 * 基本图像资源的URL
 * @param {} imageId 
 */
const getSrcImageURL = (imageId) => {
    return Url.imageDownload + imageId;
}

/**
 * 
 * 上传课程封面图像的URL
 */
const getUploadCoverImageUrl = (courseId) => {
    return Url.uploadCover + courseId;
}
/**
 * 获取封面图像， 已移除
 * @param {} imageId 
 */
const getBackgroundCourseCoverImageURL = (courseId) => {
    return "url(/rest/course/cover/" + courseId + ")";
}


export {
    Url, getBackgroundImageURL, getSrcImageURL,
    getBackgroundCourseCoverImageURL, getIntroductionURL,
    getChapterURL, getUploadCoverImageUrl
}