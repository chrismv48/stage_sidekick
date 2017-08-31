import React, {Component} from 'react'
import {Icon, Menu, Segment, Sidebar} from 'semantic-ui-react'
import {connect} from "react-redux";

// const DETAIL_SIDEBARS = {
//   'DEFAULT'
// }

class DetailSidebar extends Component {
  // state = { visible: false }

  // toggleVisibility = () => this.setState({ visible: !this.state.visible })


  render() {
    // if (!this.props.sidebarType) { return null }
    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='push'
            width='wide'
            direction='right'
            visible={true}
            icon='labeled'
            vertical
          >
            <Menu.Item name='home'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            {this.props.children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default connect(
  state => state.sidebar
)(DetailSidebar)
