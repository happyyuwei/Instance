import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { Typography, Upload, Button, message, Switch, Input, Spin } from 'antd';
import { UploadOutlined, CloudUploadOutlined } from "@ant-design/icons"
import { EditorArea } from "./panel.js"
import { Url, getBackgroundImageURL, getUploadCoverImageUrl } from './url';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/output.css'
import { parseDate, parseTime, auth } from './util.js';
import { getCourseInfoService, uploadCourseInfoService } from './service.js';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;


/**
 * 课程介绍模板
 * @param {*} props 
 * props.courseId 课程编号
 */
class IntroductionPanel extends React.Component {

    /**
     * 构造函数
     * @param {} props 
     */
    constructor(props) {
        super(props);
        //通过URL获取课程ID
        this.courseId = this.props.match.params.courseId;
        //初始化状态
        this.state = {
            //加载状态
            "loading": true,
            //编辑状态
            "editable": false,
            //课程名
            "courseName": "",
            //课程摘要
            "courseAbstract": "",
            //课程内容
            "courseContent": "",
            //课程内容状态（由Brief Editor生成与渲染）
            "editorState": "",
            //封面URL
            "courseCoverURL": "",
            //是否是老师，在老师模式下可以进行编辑
            "isTeacher": false,
            //课程更新时间
            "updateTime": "",
            //课程创建时间
            "createTime": "",
            //教师姓名
            "teacherName": ""
        }
    }

    /**
     * 渲染完预加载组件后查询
     */
    componentDidMount = () => {
        //查询权限，获取基本信息，并开始渲染
        auth(Url.isTeacher + this.courseId, this.onAuthReturn);
    }
    /**
     * 权限查询返回
     */
    onAuthReturn = (authorized) => {

        this.setState({
            "isTeacher": authorized
        });
        this.getCourseInfo(this.courseId, authorized);
    }


    /**
     * 获取课程信息
     */
    getCourseInfo = (courseId, editable) => {
        getCourseInfoService(courseId)
            .then((response) => {
                //拷贝课程信息
                const course = { ...response.data }
                //更新状态
                this.setState({
                    "courseName": course.courseName,
                    "courseAbstract": course.courseAbstract,
                    "courseContent": course.courseContent,
                    "courseCoverURL": getBackgroundImageURL(course.courseCover),
                    "editorState": BraftEditor.createEditorState(course.courseContent),
                    "updateTime": course.updateTime,
                    "createTime": course.createTime,
                    "teacherName": course.teacherName
                });
                //进入编辑模式
                if (editable) {
                    this.switchToEditMode();
                } else {
                    //浏览模式
                    this.switchToBrowserMode()
                }
                //载入主界面
                this.setState({
                    "loading": false
                })
            }).catch((error) => {
                //跳转到崩溃页面
                this.props.history.push(Url.page.courseCrack);
                // message.error("查询课程失败");
            });
    }

    /**
     * 转换为编辑模式,当课程创建者进入该页面时进入该模式。
     * 仅在页面加载时调用
     */
    switchToEditMode = () => {
        //修改状态
        this.setState({
            "editable": true
        })
    }

    /**
     * 浏览模式
     */
    switchToBrowserMode = () => {
        //修改状态
        this.setState({
            "editable": false
        })
    }

    /**
     * 改变课程摘要时调用
     * @param {*} e 
     */
    onCourseAbstractChange = (e) => {
        this.setState({
            "courseAbstract": e.target.value
        })
    }

    /**
     * 开启或关闭编辑模式
     * @param {*} checked 
     */
    onSwicthChange = (checked) => {
        if (checked) {
            this.switchToEditMode();
        } else {
            this.switchToBrowserMode();
        }
    }

    /**
     * 创建上传参数
     */
    uploadPropsFactory = () => {
        //上传参数
        const uploadProps = {
            name: "file",
            action: getUploadCoverImageUrl(this.courseId),
            headers: {
                authorization: 'authorization-text',
            },
            onChange: (info) => {
                if (info.file.status === 'done') {
                    message.success("file uploaded successfully");
                    //封面上传完毕,展示
                    //只更新封面状态
                    // @since 2020.7.15
                    //新增直接返回上传图片url，无需重新请求一次。
                    this.setState({
                        "courseCoverURL": getBackgroundImageURL(info.file.response)
                    });
                }
            },
        };
        return uploadProps;
    }

    /**
     * 当富文本剪辑框内容发生变化
     * @param {*} editorState 
     */
    onCourseEditorChange = (editorState) => {
        this.setState({
            //同时保存HTML与原生格式
            "courseContent": editorState.toHTML(),
            "editorState": editorState
        });
    }

    /**
     *  更新课程信息
     **/
    updateCourseInformation = () => {
        //上传
        uploadCourseInfoService(this.courseId, this.state.courseName,
            this.state.courseAbstract, this.state.courseContent)
            .then((response) => {
                message.success("课程信息保存成功");
                //更新时间，注意，真正的更新时间由后台服务器计算
                //本次只是从前端临时渲染，可能时间或有所差异，取决于网络传输时间
                this.setState({
                    "updateTime": Date.now()
                })
            }).catch((error) => {
                message.error("课程保存失败");
            });
    }

    /**
     * 渲染
     */
    render = () => {

        if (this.state.loading) {
            return (
                <div className="spin-wait-area">
                    <Spin className="spin" size="large" />
                </div>
            )
        } else {
            //模式切换组件
            let switchButton = <></>
            if (this.state.isTeacher) {
                switchButton = <>
                    <Switch
                        checked={this.state.editable}
                        checkedChildren="编辑"
                        unCheckedChildren="浏览"
                        onChange={this.onSwicthChange}
                    />
                    <br />
                    <br />
                </>
            }

            //上传封面组件
            let coverLoad = <></>
            if (this.state.editable) {
                coverLoad = (
                    <Upload {...this.uploadPropsFactory()}>
                        <Button>
                            <UploadOutlined /> 点击上传课程封面
                        </Button>
                    </Upload>
                )
            }

            //摘要组件
            let abstractArea = <></>
            if (this.state.editable) {
                abstractArea = (
                    <TextArea placeholder="请输入课程简介" autoSize={{ minRows: 2 }} allowClear value={this.state.courseAbstract} onChange={this.onCourseAbstractChange} />
                )
            } else {
                abstractArea = <Paragraph>{this.state.courseAbstract}</Paragraph>
            }

            //编辑框组件
            let contentArea = <></>
            if (this.state.editable) {
                contentArea = (
                    <EditorArea
                        height="30vh"
                        onEditorChange={this.onCourseEditorChange}
                        editorState={this.state.editorState}
                    >
                    </EditorArea>
                )
            } else {
                //不知道还有没有其他办法
                contentArea = <div className="braft-output-content" dangerouslySetInnerHTML={{ __html: this.state.courseContent }} />
            }

            //最后的编辑面板，只有作者才有权显示
            let editFootPanel = <></>
            if (this.state.editable) {
                editFootPanel = <Button
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    onClick={this.updateCourseInformation}>
                    保存
                    </Button>
            }


            return <div>
                {switchButton}
                {/* 课程名称 */}
                <Title level={2}>{this.state.courseName}</Title>
                <Text strong>
                    作者：{this.state.teacherName}，
                </Text>
                {/* 创建日期 */}
                <Text type="secondary" style={{ fontStyle: "italic" }}>
                    课程创建日期：{parseDate(this.state.createTime)}，上次更新于: {parseTime(this.state.updateTime)}
                </Text>
                <br />
                <br />
                {/* 课程简介 */}
                {abstractArea}
                {/* 课程封面 */}
                <div className="classroom-cover" style={{ backgroundImage: this.state.courseCoverURL }}></div>
                {coverLoad}
                <br />
                <br />
                {/* 课程内容 */}
                <Title level={4}>课程介绍</Title>
                {contentArea}
                {/* 课程简介 */}
                {/* <Title level={4}>课时安排</Title> */}
                <br />
                <br />
                {editFootPanel}

            </div>
        }
    }
}

export default IntroductionPanel;