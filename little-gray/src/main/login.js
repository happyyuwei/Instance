import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { Card, Input, Button,Checkbox,message } from 'antd';

import { UserOutlined, LoginOutlined } from "@ant-design/icons"

//加载axios做ajax传输
import axios from "axios";
import { Url } from './url';
/**
 * 用户注册面板
 */
class LoginPanel extends React.Component {

    //登录信息
    state={
        "userName":"",
        "password":""
    }

    /**
     * 密码发生变化
     * @param {*} password 
     */
    onPasswordChange=(e)=>{
        this.setState({
            "password":e.target.value
        })
    }

    /**
     * 用户名变化
     * @param {*} e 
     */
    onUserNameChange=(e)=>{
        this.setState({
            "userName":e.target.value
        })
    }

    /**
     * 登录
     */
    login=()=>{
        axios.post( Url.login, {
            userName: this.state.userName,
            password: this.state.password
        }).then((response) => {
            //登录成功
            //页面跳转
            this.props.history.push("/room");
        }).catch((error) => {
                message.error("用户名或密码错误")
        });
    }



    /**
     * 渲染函数
     */
    render = () => {
        return (
            <div className="login-container">
                <Card style={{ width: 500, marginTop: "20vh" }} bordered={false}>

                    <Input placeholder="用户名" prefix={<UserOutlined />} onChange={this.onUserNameChange} />
                    <br />
                    <br />
                    <Input.Password placeholder="密码" prefix={<UserOutlined />} onChange={this.onPasswordChange}  />
                    <br />
                    <br />
                    <Checkbox checked={true}>记住登录状态</Checkbox>
                    <br />
                    <br />
                    <Button type="primary" icon={<LoginOutlined />} onClick={this.login}>
                        登录
                    </Button>
                </Card>
            </div>

        )
    }

}

//导出组件
export default LoginPanel;