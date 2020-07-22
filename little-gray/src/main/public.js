import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
import { IconText} from './panel';
//使用什么组件加载什么组件
import { List, Avatar, message, Space, Typography, Carousel, Divider } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons"
import { getSrcImageURL, getIntroductionURL } from './url';
import { Link } from 'react-router-dom';
import { parseDate } from './util';
import { getCourseListService, followCourseService } from './service';

const { Text, Title } = Typography




/**
 * 广场面板
 */
class PublicPanel extends React.Component {

    /**
     * 构造函数
     * @param {} props 
     */
    constructor(props) {
        super(props)
        //初始化状态
        this.state = {
            //课程信息
            courseList: []
        }
    }

    /**
     * 当完成第一次渲染后开始加载数据
     */
    componentDidMount = () => {
        this.getCourseList();
    }

    /**
     * 查询所有课程
     */
    getCourseList = () => {
        getCourseListService()
            .then(response => {
                //刷新列表
                this.setState({
                    courseList: [...response.data]
                })
            }).catch(error => {
                message.error("加载课程信息错误")
            })
    }

    /**
     * 关注课程
     * @param {} courseId 
     */
    followCourse = (courseId) => {
        followCourseService(courseId)
            .then(response => {
                message.success("关注课程成功")
            })
            .catch(error => {
                message.error("关注课程失败")
            })
    }

    /**
     * 渲染函数
     */
    render = () => {

        return (
            <>
                <Carousel autoplay>
                    <div className="carousel-card">
                        <div className="carousel-content">
                            <div style={{ marginTop: "10vh" }}>
                                <span className="carousel-notice-3">Instance</span>
                                <span className="carousel-notice-1">v0.1</span>
                                <span className="carousel-notice-3">全新发布</span>
                            </div>
                            <div style={{ marginTop: "2vh" }}>
                                <span className="carousel-notice-1-5">Powered by</span>
                            </div>
                            <div>
                                <Space className="carousel-notice-1-5">
                                    React, Ant Design, Spring Boot and Mongodb
                                </Space>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-card">
                        <div className="carousel-content">
                            <div className="carousel-course-post"></div>
                        </div>
                    </div>
                    <div className="carousel-card">
                        <div className="carousel-content">
                            <h1 className="carousel-notice-3" style={{marginTop:"10vh"}}>
                                平台命名火热进行中
                                <br />
                                欢迎你的想法
                            </h1>
                        </div>
                    </div>
                    <div className="carousel-card">
                        <div className="carousel-content">
                        </div>
                    </div>
                </Carousel>
                <div className="public-center">
                    <div className="public-course">
                        <Divider orientation="left">
                            <Title level={3}>热门课程</Title>
                        </Divider>
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={this.state.courseList}
                            renderItem={course => (
                                <List.Item
                                    key={course.courseId}
                                    actions={[
                                        <IconText icon={<StarOutlined />} text="156" onClick={() => this.followCourse(course.courseId)} />,
                                        <IconText icon={<LikeOutlined />} text="156" />,
                                        <IconText icon={<MessageOutlined />} text="2" />,
                                    ]}
                                    extra={
                                        <img
                                            width={272}
                                            alt="cover"
                                            src={getSrcImageURL(course.courseCover)}
                                        />
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={getSrcImageURL(course.teacherAvatar)} />}
                                        title={<Link to={getIntroductionURL(course.courseId)}>{course.courseName}</Link>}
                                        description={<Space direction="horizon">
                                            <Text strong>作者：{course.teacherName}</Text>
                                            <Text type="secondary" style={{ fontStyle: "italic" }}>最近更新：{parseDate(course.updateTime)}</Text>
                                        </Space>}
                                    />
                                    {course.courseAbstract}
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </>
        )
    }
}

//导出组件
export default PublicPanel;