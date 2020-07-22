import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { Typography, Button, Divider, List, Switch, Space, Popover, Spin, message, Anchor } from 'antd';
import { parseDate, parseTime, auth } from './util';
import { EditorArea, EditableTitle } from './panel';
import { FileAddOutlined, SettingOutlined } from "@ant-design/icons"
import BraftEditor from 'braft-editor'
import { getChapterDetailService, saveChapterService } from './service';
import { Url } from './url';

const { Text } = Typography;

const { Link } = Anchor


/**
 * 课时详细模板
 * @param {*} props 
 */
class ChapterPanel extends React.Component {


    constructor(props) {
        super(props);
        //通过URL获取课程ID
        this.courseId = this.props.match.params.courseId;

        // 通过URL获取章节ID，注意，在更新UI而不是重新渲染时，该id不会发生变化
        this.chapterId = this.props.match.params.chapterId;
        //初始化状态
        //每一个part包含以下信息
        //例如：
        /** 
                partName: "B",
                //课程内容
                contentHTML: "",
                //课程内容状态（由Brief Editor生成与渲染）
                editorState: "",
                //该部分编辑模式
                editMode: true,
        */
        this.state = {
            //是否是加载中
            loading: true,
            //编辑模式, 总模式，还可以单独控制每一个部分
            editMode: false,
            //编辑权限
            isTeacher: false,
            //章节信息
            chapter: {
                //课时编号
                chapterNumber: 0,
                //课时名
                chapterName: "",
                //默认课程名，切记使用该属性绑定输入区，否则使用上方的属性会造成循环渲染
                defaultChapterName: "此处输入题目",
                //更新时间
                updateTime: 0,
                //创建时间
                createTime: 0,
                //小节列表
                partList: [

                ]
            }
        }
    }


    /**
     * 权限查询返回
     */
    onAuthReturn = (authorized) => {
        this.setState({
            "isTeacher": authorized
        });
        this.getChapterDetail(
            this.props.match.params.courseId,
            this.props.match.params.chapterId
        );
    }

    /**
     * 第一次更新完组件后进行渲染，仅仅在componentDidUpdate中实现，第一次将无法被加载。
     */
    componentDidMount = () => {
        auth(Url.isTeacher + this.courseId, this.onAuthReturn);
    }

    /**
     * 由于在切换章节的时候，该面板不会重头渲染，因此需要使用该hook来重新加载数据
     */
    componentDidUpdate = () => {
        if (this.props.match.params.chapterId !== this.chapterId) {
            this.chapterId = this.props.match.params.chapterId
            // 每次进入不同路由，就重新加载。
            auth(Url.isTeacher + this.courseId, this.onAuthReturn);
        }
    }


    /**
     * 获取所有章节信息
     * @param {*} courseId 
     * @param {*} chapterId 
     */
    getChapterDetail = (courseId, chapterId) => {
        //重新设置加载在状态
        this.setState({
            loading: true
        })
        //开始加载
        getChapterDetailService(courseId, chapterId)
            .then(response => {
                //更新章节信息
                this.updateChapterState({ ...response.data })
            }).catch(error => {
                // message.error("加载章节详情失败")
                //跳转到崩溃页面
                this.props.history.push(Url.page.courseCrack);
            })
    }

    /**
     * 更新章节状态，只有加载完成才允许调用该函数
     * @param {*} chapter 
     */
    updateChapterState = (chapter) => {

        //添加渲染状态
        chapter.defaultChapterName = chapter.chapterName;
        for (let i = 0; i < chapter.partList.length; i++) {
            chapter.partList[i].defaultPartName = chapter.partList[i].partName;
            chapter.partList[i].editorState = BraftEditor.createEditorState(chapter.partList[i].contentHTML);
            //默认不可编辑
            chapter.partList[i].editMode = false;
        }
        //更新状态
        this.setState({
            loading: false,
            chapter: chapter
        })
    }


    /**
     * 转换为编辑模式,当课程创建者进入该页面时进入该模式。
     * 仅在页面加载时调用
     */
    switchToEditMode = () => {
        const chapter = this.state.chapter;
        //每个小节的模式都修改
        for (let i = 0; i < chapter.partList.length; i++) {
            chapter.partList[i].editMode = true;
        }
        //修改状态
        this.setState({
            editMode: true,
            chapter: chapter
        })

    }

    /**
     * 浏览模式
     */
    switchToBrowserMode = () => {
        const chapter = this.state.chapter;
        //每个小节的模式都修改
        for (let i = 0; i < chapter.partList.length; i++) {
            chapter.partList[i].editMode = false;
        }
        //修改状态
        this.setState({
            editMode: false,
            chapter: chapter
        })
    }



    /**
     * 编辑模式变化
     */
    onSwicthChange = (checked) => {
        if (checked) {
            this.switchToEditMode();
        } else {
            this.switchToBrowserMode();
        }
    }

    /**
     * 当小节内的开关发生变化
     */
    onPartSwicthChange = (partIndex, checked) => {
        //只修改该部分的编辑模式
        //第一次尝试一下这种写法
        //@since 2020.7.14
        const { chapter } = this.state;
        chapter.partList[partIndex].editMode = checked;
        this.setState({
            chapter: chapter
        })
    }

    /**
     * 章节名发生变化时调用
     * @param {} text 
     */
    onChapterChange = (text) => {
        const { chapter } = this.state;
        chapter.chapterName = text;
        this.setState({
            chapter: chapter
        })
    }

    /**
     * 小节标题发生变化时调用
     * @param {*} text
     */
    onTitleChange = (index, text) => {
        const { chapter } = this.state;
        chapter.partList[index].partName = text;
        this.setState({
            chapter: chapter
        })
    }

    /**
    * 当富文本剪辑框内容发生变化
    * @param {*} editorState 
    */
    onCourseEditorChange = (partIndex, editorState) => {
        const chapter = this.state.chapter;
        //同时保存HTML与原生格式
        chapter.partList[partIndex].contentHTML = editorState.toHTML();
        chapter.partList[partIndex].editorState = editorState;
        this.setState({
            chapter: chapter
        });
    }

    /**
     * 继续创建小节
     * 在指定位置创建。如果该小节已经存在则，后续的所有小节向后移动
     * 如果该小节非法，或者超出最后一小节，则在末尾创建
     * 如果仅仅顺序向后插入，建议输入-1
     */
    createNewPart = (partIndex) => {
        //课程节好与数组关系差1，节号从1 开始，数组下标0开始。
        const { chapter } = this.state;
        //若<0则插入最后
        if (partIndex < 0) {
            partIndex = chapter.partList.length;
        }
        //才掌握splice用法，既可以添加也可以删除
        chapter.partList.splice(partIndex, 0, {
            //默认课程名，用于一开始初始化组件，切记不能把用于更新的partName绑定到输入框中，否则会造成循环渲染
            defaultPartName: "此处输入课题",
            //课程名，用于更新
            partName: "此处输入课题",
            //课程内容
            contentHTML: "",
            //课程内容状态（由Brief Editor生成与渲染）
            editorState: "",
            //该部分编辑模式
            editMode: true,
        });
        //更新状态
        this.setState({
            chapter: chapter
        })
    }

    /**
     * 删除小节
     */
    deletePart = (partIndex) => {
        const { chapter } = this.state;
        chapter.partList.splice(partIndex, 1);
        //更新状态
        this.setState({
            chapter: chapter
        })
    }

    /**
     * 保存章节
     */
    saveChapter = () => {
        let partList = []
        for (let i = 0; i < this.state.chapter.partList.length; i++) {
            partList.push({
                partName: this.state.chapter.partList[i].partName,
                contentHTML: this.state.chapter.partList[i].contentHTML
            });
        }
        saveChapterService(this.courseId, this.state.chapter.chapterName, this.props.match.params.chapterId, partList)
            .then(response => {
                message.success("保存文章成功")
            }).catch(error => {
                message.error("保存文章错误")
            })
    }

    /**
     * 更新所有小节号，小节号为index+1，需要在添加和删除小节后调用。
     * 目前就这么设计了。不是聪明的办法
     * @since 2020.7.14
     * @todo
     * 目前去掉了课程编号的属性，直接使用数组下标
     */

    /**
     * 渲染
     */
    render = () => {
        //模式切换组件
        let switchButton = <></>
        if (this.state.isTeacher) {
            switchButton = <>
                <Switch
                    checked={this.state.editMode}
                    checkedChildren="编辑"
                    unCheckedChildren="浏览"
                    onChange={this.onSwicthChange}
                />
                <br />
                <br />
            </>
        }

        //增加小节按钮
        let editButtonPanel = <></>
        if (this.state.editMode) {
            editButtonPanel =
                <Space>
                    <Button type="primary" icon={<FileAddOutlined />} onClick={() => this.createNewPart(-1)}>
                        继续创建
                    </Button>
                    <Button type="primary" icon={<FileAddOutlined />} onClick={this.saveChapter}>
                        保存
                    </Button>
                </Space>
        }


        //小节编辑工具按钮，只要在总编辑模式下，该按钮均会出现，不会受局部按钮的影响
        const partPopMenuButtonFactory = (index, part) => {
            if (this.state.editMode) {
                return <Popover placement="right" content={
                    <div>
                        <Switch
                            checked={part.editMode}
                            defaultChecked onChange={
                                (checked) => this.onPartSwicthChange(index, checked)
                            } size="small" />
                        <Button type="link">在上方插入小节</Button>
                        <Button type="link">在下方插入小节</Button>
                        <Button type="link" danger onClick={() => { this.deletePart(index) }}>删除本节</Button>
                    </div>
                }>
                    <Button type="dashed" icon={<SettingOutlined />} size="small"></Button>
                </Popover>
            } else {
                return <></>
            }
        }

        //富文本剪辑框
        //包含多个实例
        //这一个有点难写
        const partListItemFactory = (index, part) => {
            if (part.editMode) {
                return (
                    <List.Item style={{ paddingLeft: 0 }}>
                        {/* 这个div标签要加，不知道为什么 */}
                        <div style={{ width: "100%" }}>
                            <Divider orientation="left">
                                <Space>
                                    <EditableTitle
                                        uneditablePart={"第" + (index + 1) + "节："}
                                        editablePart={part.defaultPartName}
                                        editable={true}
                                        onChange={(text) => this.onTitleChange(index, text)}
                                    />
                                    {partPopMenuButtonFactory(index, part)}
                                </Space>
                            </Divider>
                            <EditorArea
                                onEditorChange={
                                    (editorState) => { this.onCourseEditorChange(index, editorState) }
                                }
                                editorState={this.state.chapter.partList[index].editorState}
                            />
                        </div>
                    </List.Item >
                )
            } else {
                return (
                    <List.Item style={{ paddingLeft: 0 }}>
                        {/* 这里要加div 宽度100%, 否则会和主内容显示在一行上 */}
                        <div style={{ width: "100%" }}>
                            <Divider orientation="left">
                                <Space>
                                    {/* 该模式不可编辑 */}
                                    <EditableTitle
                                        uneditablePart={"第" + (index + 1) + "节："}
                                        editablePart={part.partName}
                                        editable={false}
                                    />
                                    {partPopMenuButtonFactory(index, part)}
                                </Space>
                            </Divider>
                            {/* 不知道还有没有其他办法 */}
                            <div dangerouslySetInnerHTML={{ __html: this.state.chapter.partList[index].contentHTML }} />
                        </div>
                    </List.Item>
                )
            }
        }

        if (this.state.loading) {
            // return <Skeleton active paragraph={{rows:7}}/>
            return (
                <div className="spin-wait-area">
                    <Spin className="spin" size="large" />
                </div>
            )
        } else {
            return (
                <div>
                    {switchButton}
                    <EditableTitle
                        uneditablePart={"第 " + this.state.chapter.chapterNumber + " 章: "}
                        editablePart={this.state.chapter.defaultChapterName}
                        editable={this.state.editMode}
                        onChange={this.onChapterChange}
                    />
                    <br />
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                        课程创建日期：{parseDate(this.state.chapter.createTime)}，上次更新于: {parseTime(this.state.chapter.updateTime)}
                    </Text>
                    <br />
                    <br />
                    <List
                        size="large"
                        split={false}
                        dataSource={this.state.chapter.partList}
                        renderItem={(part, index) => partListItemFactory(index, part)}
                    />
                    <Divider />
                    {editButtonPanel}
                </div>
            )
        }
    }
}



export default ChapterPanel;