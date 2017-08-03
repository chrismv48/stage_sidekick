/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';

const {SubMenu} = Menu;
const MenuItemGroup = Menu.ItemGroup;
const {Header, Footer, Sider, Content} = Layout;

export default class HomePage extends Component { //React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let myInit = {
      method: 'GET',
      headers: headers,
    };
    fetch('/api', myInit)
      .then((resp) => {
        return resp.json()
      })
      .then((data) => {
        this.setState({greeting: data.greeting})
      })
  }
  render() {
    return (
      <div>
        <Layout>
          <Header className="header">
            <div className="logo"/>
            <Menu
              mode="horizontal"
            >
              <Menu.Item key="mail">
                <Icon type="mail"/>Navigation One
              </Menu.Item>
              <Menu.Item key="app" disabled>
                <Icon type="appstore"/>Navigation Two
              </Menu.Item>
              <SubMenu title={<span><Icon type="setting"/>Navigation Three - Submenu</span>}>
                <MenuItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <Menu.Item key="alipay">
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
              </Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} style={{background: '#fff'}}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{height: '100%', borderRight: 0}}
              >
                <SubMenu key="sub1" title={<span><Icon type="user"/>subnav 1</span>}>
                  <Menu.Item key="1">option1</Menu.Item>
                  <Menu.Item key="2">option2</Menu.Item>
                  <Menu.Item key="3">option3</Menu.Item>
                  <Menu.Item key="4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="laptop"/>subnav 2</span>}>
                  <Menu.Item key="5">option5</Menu.Item>
                  <Menu.Item key="6">option6</Menu.Item>
                  <Menu.Item key="7">option7</Menu.Item>
                  <Menu.Item key="8">option8</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="notification"/>subnav 3</span>}>
                  <Menu.Item key="9">option9</Menu.Item>
                  <Menu.Item key="10">option10</Menu.Item>
                  <Menu.Item key="11">option11</Menu.Item>
                  <Menu.Item key="12">option12</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{padding: '0 24px 24px'}}>
              <Breadcrumb style={{margin: '12px 0'}}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                Content
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}
