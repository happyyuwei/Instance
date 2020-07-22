import React from 'react';
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { Layout, Menu, message } from 'antd';
//路由组件
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import { AppstoreOutlined, LinkOutlined, CarryOutOutlined } from "@ant-design/icons"
import LoginPanel from './main/login';
import "./App.css"
import RoomPanel from './main/room';
import PublicPanel from './main/public';
import ClassroomPanel from './main/classroom';
import { Url } from './main/url';
import { logoutService } from './main/service';
import { NotLoginPanel } from './main/error'
const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;



class App extends React.Component {

  /**
   * 退出账号
   */
  logout = () => {
    console.log(this.props)
    logoutService()
      .then(response => {
        message.success("退出账号");
        //强制重定向到主页
        window.location.href = Url.page.home;
      }).catch(error => {
        console.log(error)
        message.error("您尚未登录")
      })
  }

  render = () => {
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header>
            <Menu theme="dark" mode="horizontal" selectable={false}>
              <Menu.Item key="public" icon={<AppstoreOutlined />}>
                <Link to={Url.page.public}>
                  课程大厅
              </Link>
              </Menu.Item>
              <Menu.Item key="room" icon={<CarryOutOutlined />}>
                <Link to={Url.page.room}>
                  个人空间
              </Link>
              </Menu.Item>
              <SubMenu icon={<LinkOutlined />} title="账户">
                <Menu.Item key="login">
                  <Link to={Url.page.login}>
                    登录
                </Link>
                </Menu.Item>
                <Menu.Item key="register">
                  注册新用户
              </Menu.Item>
                <Menu.Item key="exit" onClick={this.logout}>
                  退出账户
              </Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          {/* 主视图 */}
          <Layout>
            <Content style={{ margin: "0 0", backgroundColor: "white" }}>
              {/* 由路由跳转 */}
              {/* 主页和public页为一页 */}
              <Route path={Url.page.home} exact component={PublicPanel} />
              <Route path={Url.page.login} exact component={LoginPanel} />
              <Route path={Url.page.room} exact component={RoomPanel} />
              <Route path={Url.page.public} exact component={PublicPanel} />
              <Route path={Url.page.classroom} component={ClassroomPanel} />
              <Route path={Url.page.notLogin} component={NotLoginPanel} />
            </Content>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>Instance ©2020 Created by 变蝙蝠侠</Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
