import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { Tabs, List, Button, Modal, Input, message, Spin } from 'antd';
import { AppleOutlined, AndroidOutlined, PlusOutlined, TwitterOutlined } from "@ant-design/icons"
import { Url, getIntroductionURL } from './url';
import { AvatarCard, CoursePanel, LoadingComponent } from './panel';
import { parseTime } from './util';
import { getUserService, getLearningListService, getTeachingListService, createCourseService } from './service';
const { TabPane } = Tabs;


/**
 * 个人空间面板,继承组件可以免去重复写加载动画
 */
class RoomPanel extends LoadingComponent {


    /**
     * 构造函数
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        //初始化状态
        let state = {
            //加载中
            // loading: true,
            //用户名
            userName: "",
            //头像
            avatar: "",
            //教授的课程
            teachingList: [],
            //学习的课程
            learningList: [],
            //模态框，用于创建课程
            modalVisible: false,
            modalInput: "",
            //loading
            teachingLoading: true,
            learningLoading: true
        }
        //更新状态
        this.initState(state);
    }
    /**
     * 获取用户信息
     */
    getUser = () => {
        //获取登录信息
        getUserService()
            .then((response) => {
                //加载完成
                this.loadingFinish();
                //更新登录信息
                this.setState({
                    userName: response.data.userName,
                    avatar: response.data.avatar,
                });
                //查询课程表
                this.getTeachingList();
                this.getLearningList();
            }).catch((error) => {
                //页面跳转回登录界面
                this.props.history.push(Url.page.notLogin);
            });
    }
    /**
     * 查询教学课程
     */
    getTeachingList = () => {
        //获取教学课程列表
        getTeachingListService()
            .then((response) => {
                //更新课程信息与登录状态
                this.setState({
                    teachingList: [...response.data],
                    teachingLoading: false
                })
            }).catch((error) => {
                //页面跳转回登录界面
                message.error("查询学习课程失败")
            });
    }

    /**
     * 查询学习信息
     */
    getLearningList = () => {
        //获取教学课程列表
        getLearningListService()
            .then((response) => {
                //更新课程信息与登录状态
                this.setState({
                    learningList: [...response.data],
                    learningLoading: false
                })
            }).catch((error) => {
                //页面跳转回登录界面
                message.error("查询教学课程失败")
            });
    }

    /**
     * 在渲染之前查询权限
     */
    componentDidMount = () => {
        this.getUser();
    }

    /**
     * 创建课程
     */
    createCourse = () => {
        createCourseService(this.state.modalInput)
            .then((response) => {
                const courseId = response.data.courseId;
                //创建成功
                //关闭模态框
                this.setState({
                    modalVisible: false,
                });
                //页面跳转
                this.props.history.push(getIntroductionURL(courseId));
            }).catch((error) => {
                this.setState({
                    modalVisible: false,
                });
                message.error("创建课程失败");
            });
    }


    /**
     * 展示模态框
     */
    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    /**
     * 模态框取消
     * @param {*} e 
     */
    handleCancel = e => {
        this.setState({
            modalVisible: false,
        });
    };

    /**
     * 
     * @param {*} e 
     */
    onModalChange = (e) => {
        this.setState({
            "modalInput": e.target.value
        })
    }

    /**
     * 进入教室
     */
    enterClassroom = (courseId) => {
        this.props.history.push(getIntroductionURL(courseId))
    }



    /**
     * 渲染函数
     */
    renderMain = () => {
        //我的学习课程面板
        let learningTab = <TabSpan></TabSpan>
        if (this.state.learningLoading === false) {
            learningTab = <List
                size="large"
                bordered={false}
                dataSource={this.state.learningList}
                renderItem={item => <List.Item>
                    <CoursePanel
                        progressBar={false}
                        courseName={item.courseName}
                        courseDescription={item.courseAbstract}
                        courseCover={item.courseCover}
                        courseUpdateTime={parseTime(item.updateTime)}
                        buttonTitle="进入学习"
                        teacherName={item.teacherName}
                        buttonClick={() => {
                            this.enterClassroom(item.courseId);
                        }}
                    />
                </List.Item>}
            />
        }

        //我的授课课程面板
        let teachingTab = <TabSpan></TabSpan>
        if (this.state.teachingLoading === false) {
            teachingTab =
                <List
                    size="large"
                    bordered={false}
                    dataSource={this.state.teachingList}
                    renderItem={item => <List.Item>
                        <CoursePanel
                            progressBar={false}
                            courseName={item.courseName}
                            courseDescription={item.courseAbstract}
                            courseCover={item.courseCover}
                            courseUpdateTime={parseTime(item.updateTime)}
                            buttonTitle="备课"
                            teacherName={item.teacherName}
                            buttonClick={() => {
                                this.enterClassroom(item.courseId);
                            }}
                        />
                    </List.Item>}
                />
        }

        return (
            //不知道哪里莫名其妙出来的水平滚筒条，将超出部分隐藏总算解决该问题。fuck!!!
            <div style={{ overflow: "hidden" }}>
                <AvatarCard avatar={this.state.avatar}
                    title={this.state.userName + ", 你好"}
                    description="知识的价值不在于占有，而在于使用。"
                >
                </AvatarCard>
                <Tabs style={{ marginLeft: 20, marginRight: 20 }}
                    tabBarExtraContent={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={this.showModal}>创建课程</Button>}>
                    <TabPane tab={
                        <span><AppleOutlined />我学习的课程</span>}
                        key="learning-course-room">
                        {learningTab}
                    </TabPane>
                    <TabPane tab={
                        <span><AndroidOutlined />我创建的课程</span>}
                        key="teaching-course-room">
                        {teachingTab}
                    </TabPane>
                </Tabs>
                <Modal
                    title="创建新课程"
                    visible={this.state.modalVisible}
                    onOk={this.createCourse}
                    onCancel={this.handleCancel}
                >
                    <Input size="large" placeholder="课程名称" prefix={<TwitterOutlined />} onChange={this.onModalChange} />
                </Modal>
            </div>
        )
    }
}


function TabSpan(props) {
    return <div className="spin-wait-area">
        <Spin style={{ marginLeft: "50%", marginTop: "10%" }} size="large" />
    </div>
}

//导出组件
export default RoomPanel;