import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
import "./panel.css"
//使用什么组件加载什么组件
import { Typography, Progress, Button, Space, Spin, Icon } from 'antd';
import { getBackgroundImageURL } from './url';
import { ExperimentOutlined } from "@ant-design/icons"
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import "braft-editor/dist/index.css"
import { uploadFunction } from "./util"

const { Title, Text, Paragraph } = Typography;

/**
 * 头像框卡片，包含背景
 */
function AvatarCard(props) {
    return (
        <div className="avatar-background-layout">
            <div className="avatar-main-layout">
                <div className="avatar-img-layout">
                    <div className="avatar" style={{ backgroundImage: getBackgroundImageURL(props.avatar) }}>
                    </div>
                </div>
                <div className="avatar-title-layout">
                    <div className="avatar-title">
                        <Title level={3} style={{ color: "white" }}>{props.title}</Title>
                        <Text level={4} style={{ color: "white" }} strong>{props.description}</Text>
                    </div>
                </div>
            </div>
        </div>
    )
}


/**
 * 
 * progressBar={true}
   courseName= {item.courseName}
   courseUpdateTime= 时间字符串
   teacherName 教师姓名
   courseDescription={item.courseAbstract}
   courseCover={item.courseCover}
   buttonTitle="备课"
 * 课程面板
 * @param {} props 
 */
function CoursePanel(props) {

    let progressBar = <></>;
    if (props.progressBar === true) {
        progressBar = (
            <>
                <div>
                    <Text strong>完成学习情况</Text>
                </div>
                <Progress type="circle" percent={10} width={100} />
            </>
        );
    }

    return (
        <div className="course-background-layout">
            <div className="course-cover-layout" style={{ backgroundImage: getBackgroundImageURL(props.courseCover) }}>
            </div>
            <div className="course-description-layout">
                <Title level={2}>{props.courseName}</Title>
                <Space direction="vertical">
                    <Text strong>作者：{props.teacherName}</Text>
                    <Text type="secondary" style={{ fontStyle: "italic" }}>最近更新：{props.courseUpdateTime}</Text>
                    <Paragraph>
                        {props.courseDescription}
                    </Paragraph>
                    <Button type="primary" icon={<ExperimentOutlined />} size="small" onClick={props.buttonClick}>
                        {props.buttonTitle}
                    </Button>
                </Space>
            </div>
            <div className="course-empty-layout" />
            <div className="course-progress-layout">
                {progressBar}
            </div>
        </div>
    )
}


/**
 * 编辑区域，继承于braft editor
 * height="30vh"
   onEditorChange={this.onCourseEditorChange}
   editorState={this.state.editorState}
 * @param {*} props 
 */
function EditorArea(props) {
    return <BraftEditor
        value={props.editorState}
        onChange={props.onEditorChange}
        style={{ border: "2px solid #ddd", borderRadius: 10 }}
        contentStyle={{ height: props.height }}
        media={{ uploadFn: (params) => { uploadFunction() } }}
    />
}

/**
 * props.uneditablePart 不可编辑部分
 * props.uneditablePart 可编辑部分
 * props.editable 是否可编辑
 * props.onChange 内容改变事件
 * 可编辑的标题
 * @param  props 
 */
class EditableTitle extends React.Component {

    constructor(props) {
        super(props)
        //定义ref
        //第一次学习使用ref强制获取可编辑div的内部innterText
        //@since 2020.7.14
        this.inputText = React.createRef()
    }

    /**
     * 每次编辑都会调用该函数
     * 核心由onInput回调
     */
    onTextChange = () => {
        //将改变的内容回调
        //创建的ref可以直接使用组件内部的内容，相当于替代了id
        if (this.props.onChange !== undefined) {
            this.props.onChange(this.inputText.current.innerHTML)
        }
    }

    render = () => {
        let className = "title-normal"
        if (this.props.editable) {
            className = "title-editable"
        }

        return <span className={className}>
            {this.props.uneditablePart}
            <span
                contentEditable={this.props.editable}
                suppressContentEditableWarning={true}
                ref={this.inputText}
                onInput={this.onTextChange}
                style={{ outline: "none" }}
            >
                {this.props.editablePart}
            </span>
        </span>
    }
}

/**
 * 图片文字面板,
 * 第一次尝试使用这个方法传递 props
 */
const IconText = ({ icon, text, onClick }) => (
    <Space onClick={onClick}>
        {icon}
        {text}
    </Space>
);


/**
 * 载入组件，可被继承
 */
class LoadingComponent extends React.Component {

    constructor(props) {
        super(props)
        //初始化状态
        this.state = {
            //载入状态
            _loading: true
        };
        /**
     * 仅仅在第一次组件渲染前调用，如构造函数中
     * @param {*} state 
     */
        this.initState = (otherState) => {
            Object.assign(this.state, otherState)
        };

        /**
         * 载入完成
         */
        this.loadingFinish = () => {
            this.setState({
                _loading: false
            });
        }
    }


    /**
     * 主渲染方法，需要被继承
     */
    renderMain = () => {
        return <></>
    }

    /**
     * react 原生渲染
     */
    render = () => {
        //加载中
        if (this.state._loading) {
            return (
                <div className="spin-wait-area">
                    <Spin style={{ marginTop: "20%", marginLeft: "50%" }} size="large" />
                </div>
            )
        } else {
            //加载完成
            return this.renderMain();
        }
    }

}


function Logo({src, width, height}) {
    return <img
    src={src}
    width={width}
    height={height}
    alt=""
    />
}



export {
    AvatarCard, CoursePanel, EditorArea,
    EditableTitle, IconText, LoadingComponent, Logo
}