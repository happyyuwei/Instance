
/**
 * 错误提示页面
 */

import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
import { Result, Button } from 'antd'
import { Url } from './url';
import { Link } from 'react-router-dom';



class NotLoginPanel extends React.Component {
    render = () => {
        return (
            <div>
                <Result
                    status="403"
                    title="400"
                    subTitle="抱歉，检测到你还没登录。"
                    extra={
                        <Link to={Url.page.login}>
                            <Button type="primary">前往登录</Button>
                        </Link>
                    }
                />
            </div>
        )
    }
}

class CourseCrackPanel extends React.Component {
    render = () => {
        return (
            <div>
                <Result
                    status="500"
                    title="500"
                    subTitle="抱歉，无法找到该课程。"
                    extra={
                        <Link to={Url.page.room}>
                            <Button type="primary">返回个人空间</Button>
                        </Link>
                    }
                />
            </div>
        )
    }
}

export { NotLoginPanel, CourseCrackPanel }