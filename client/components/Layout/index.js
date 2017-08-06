import React from 'react';
import {Divider, Icon, Menu} from "semantic-ui-react";
// import styled from 'styled-components';
import './Layout.scss'
import {Link} from "react-router";

class Layout extends React.Component { // eslint-disable-line react/prefer-stateless-function
  state = {
    thisPage: null
  };

  handleItemClick = (e, { name }) => this.setState({ thisPage: name })

  render() {
    const {thisPage} = this.state
    return (
      <div>
        <div className="sidebar-fixed">
          <div className="logo">
            <p style={{textAlign: 'center'}}>LOGO</p>
          </div>
          <Divider/>
          <div className="sidebar-menu">
            <Menu icon='labeled' size='tiny' id="sidebar-menu" inverted vertical borderless fluid>

              <Menu.Item as={Link} to="/directory" id="sidebar-button" name='directory' active={thisPage === 'directory'}
                         onClick={this.handleItemClick}>
                <Icon name='address book outline'/>
                Directory
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='scenes' active={thisPage === 'scenes'}
                         onClick={this.handleItemClick}>
                <Icon name='film'/>
                Scenes
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='budget' active={thisPage === 'budget'}
                         onClick={this.handleItemClick}>
                <Icon name='dollar'/>
                Budget
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='gallery' active={thisPage === 'gallery'}
                         onClick={this.handleItemClick}>
                <Icon name='camera retro'/>
                Gallery
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='costumes' active={thisPage === 'costumes'}
                         onClick={this.handleItemClick}>
                <Icon name='shopping bag'/>
                Costumes
              </Menu.Item>

            </Menu>
          </div>
        </div>
        <div className="top-nav">
          <div className="top-nav-header">
            <h2>
              The Wiz
            </h2>
          </div>
          <div className="top-nav-button-group">
            <Menu icon size="large" borderless compact secondary>
              <Menu.Item name='search' fitted onClick={this.handleItemClick}>
                <Icon color="grey" name='search'/>
              </Menu.Item>

              <Menu.Item name='notifications' fitted onClick={this.handleItemClick}>
                <Icon color="grey" name='alarm'/>
              </Menu.Item>

              <Menu.Item name='calendar' fitted onClick={this.handleItemClick}>
                <Icon color="grey" name='calendar'/>
              </Menu.Item>

              <Menu.Item name='user_settings' fitted onClick={this.handleItemClick}>
                <Icon color="grey" name='user'/>
              </Menu.Item>

              <Menu.Item name='settings' fitted onClick={this.handleItemClick}>
                <Icon color="grey" name='setting'/>
              </Menu.Item>
            </Menu>
          </div>
        </div>
        <div className="content">
          <div className="top-nav-secondary">
            <Menu pointing secondary borderless>
              <Menu.Item name='home' active={thisPage === 'gallery'} onClick={this.handleItemClick}/>
              <Menu.Item name='messages' active={thisPage === 'gallery'} onClick={this.handleItemClick}/>
              <Menu.Item name='friends' active={thisPage === 'friends'} onClick={this.handleItemClick}/>
            </Menu>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {};

export default Layout;
