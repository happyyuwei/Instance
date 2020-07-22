import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { Layout, Menu, Affix, Tooltip, Popover, Button, message } from 'antd';
import { ProfileOutlined, HighlightOutlined, WarningOutlined, ReadOutlined } from "@ant-design/icons"
import { Route, Link } from 'react-router-dom'
import IntroductionPanel from './intro.js';
import ChapterPanel from './learn.js';
import { Url, getIntroductionURL, getChapterURL } from './url.js';
import { getAllChapterService, createChapterService, deleteChapterService } from './service.js';
import { LoadingComponent } from './panel.js';
import { CourseCrackPanel } from "./error"
import { auth } from './util.js';

const { Content, Sider } = Layout;






/**
 * 教室面板
 */
class ClassroomPanel extends LoadingComponent {



    constructor(props) {
        super(props);

        //读取课程编号
        this.courseId = this.props.match.params.courseId;
        //章节编号
        //注意，章节编号不能在构造函数设置，否则之后不会再变化
        //直接读取props即可，每次props变化都会重新渲染的
        // this.chapterId = this.props.match.params.chapterId;
        //基本页面渲染状态
        // this.introductionReadingState = "introduction";
        // this.learningReadingState = "learning"
        //初始化状态
        let state = {
            // readingState: this.introductionReadingState
            //
            //编辑权限
            isTeacher: false,
            //当前章节号, 用于与左侧栏选中位置同步
            selectedKey: this.props.match.params.chapterId,
            /**
             * 左侧状态栏目录，每个元素存放：课程id，课程名
             * 每个chapter包含元素如下
            chapterId:  chapterInfo.chapterId,
            chapterName: chapterInfo.chapterName,
            chapterNumber: chapterInfo.chapterNumber
             */
            catalog: []
        }
        this.initState(state);
    }

    /**
     * 等组件加载完毕，即可开始查询
     */
    componentDidMount = () => {
        auth(Url.isTeacher + this.courseId, this.onAuthReturn);
    }
    /**
     * 权限查询返回
     */
    onAuthReturn = (authorized) => {

        this.setState({
            isTeacher: authorized
        });
        //查询所所有章节
        this.getAllChapters()
    }


    /**
     * 获取所有章节
     */
    getAllChapters = () => {
        getAllChapterService(this.courseId)
            .then((response) => {
                //加载完成
                this.loadingFinish();
                //更新目录
                this.setState({
                    catalog: [...response.data]
                })
            }).catch((error) => {
                // message.error("加载章节列表出错")
                //只要登录就能看到课程章节
                this.props.history.push(Url.page.notLogin);
            });
    }

    /**
     * 创建章节
     */
    createChapter = () => {
        //只有服务端创建成功才会渲染
        createChapterService(this.courseId)
            .then(response => {
                const chapterInfo = { ...response.data };
                const catalog = this.state.catalog;
                catalog.push({
                    chapterId: chapterInfo.chapterId,
                    chapterName: chapterInfo.chapterName,
                    chapterNumber: chapterInfo.chapterNumber
                });
                this.setState({
                    catalog: catalog
                })
                message.success("创建章节成功");
                this.setState({
                    selectedKey: chapterInfo.chapterId
                });
                //跳转至新创建的章节
                // this.props.history.push(getChapterURL(this.courseId, chapterInfo.chapterId));
            }).catch(error => {
                message.error("创建章节失败")
            })
    }

    /**
     * 删除章节
     */
    deleteChapter = () => {
        deleteChapterService(this.courseId, this.props.match.params.chapterId)
            .then(response => {
                const chapterInfo = { ...response.data };
                const catalog = this.state.catalog;
                catalog.splice(chapterInfo.chapterNumber - 1, 1);
                this.setState({
                    catalog: catalog
                })
                message.success("删除章节成功")
                //删除章节后，退回到首页
                this.setState({
                    //首页的key为0，需要和URL中的chapterId一致为0
                    selectedKey: "0"
                })
            }).catch(error => {
                message.error("删除章节失败")
            })
    }

    /**
     * 当侧栏被选中
     * 将selectedKey置于选中
     * 通常情况下不需要这样设计，但是本人将selectedKey动态绑定，因此需要
     */
    onMenuSelect = (e) => {
        this.setState({
            selectedKey: e.key
        })
    }

    /**
     * 渲染进程
     */
    renderMain = () => {
        //生成目录
        const catalogItem = this.state.catalog.map(
            (chapter, index) => {
                return (
                    <Menu.Item key={chapter.chapterId} icon={<ReadOutlined />}>
                        <Link to={getChapterURL(this.courseId, chapter.chapterId)}>
                            {"课时" + (index + 1) + ": " + chapter.chapterName}
                        </Link>
                    </Menu.Item>
                )
            }
        );

        //固定工具箱
        let toolBox = <></>
        if (this.state.isTeacher) {
            toolBox = (
                <>
                    {/* 固定右下角按钮 */}
                    {/* 创建按钮 */}
                    <Tooltip title="创建章节" color="#108ee9">
                        <Button type="primary"
                            onClick={this.createChapter}
                            shape="circle" icon={<HighlightOutlined />}
                            className="tip-button" >

                        </Button>
                    </Tooltip>
                    {/* 其他工具按钮 */}
                    <Popover content={
                        <div>
                            <Button type="link">上移一章</Button>
                            <Button type="link">下移一章</Button>
                            <Button type="link" danger onClick={this.deleteChapter}>删除本章</Button>
                        </div>
                    } placement="left">
                        <Button type="danger" shape="circle" icon={<WarningOutlined />} className="popover-button"></Button>
                    </Popover>
                </>
            )
        }

        return <Layout>
            <Affix offsetTop={0}>
                <Sider width={200} mode="inline" className="classroom-sider-layout">
                    <Menu defaultSelectedKeys={[this.props.match.params.chapterId]}
                        selectedKeys={[this.state.selectedKey]}
                        style={{ minHeight: "100%" }}
                        onClick={this.onMenuSelect}>
                        {/* 首页的key规定为 0 */}
                        <Menu.Item key="0" icon={<ProfileOutlined />}>
                            <Link to={getIntroductionURL(this.courseId)}>课程介绍</Link>
                        </Menu.Item>
                        {catalogItem}
                    </Menu>
                </Sider>
            </Affix>
            <Layout className="classroom-main-layout">
                <Content>
                    <Route path={Url.page.introduction} component={IntroductionPanel} />
                    <Route path={Url.page.chapter} component={ChapterPanel} />
                    <Route path={Url.page.courseCrack} component={CourseCrackPanel} />
                </Content>
            </Layout>
            {toolBox}
        </Layout>
    }
}


export default ClassroomPanel;