import React, {Component} from 'react';
import {Divider, Icon, Menu} from "semantic-ui-react";
import './Layout.scss'
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react/index";
import {observable} from "mobx";
import Character from "containers/Character/Character";
import Scene from "containers/Scene/Scene";
import Costume from "containers/Costume/Costume";
import Actor from "containers/Actor/Actor";
import CostumeItem from "containers/CostumeItem/CostumeItem";
import {singularResourceIdCamelCased} from 'helpers'

const resourceToComponent = {
  'characters': Character,
  'scenes': Scene,
  'costumes': Costume,
  'actors': Actor,
  'costume_items': CostumeItem
}

@inject("resourceStore", "uiStore") @observer
class Layout extends Component {

  renderItemSidebar() {
    let {selectedResourceId, selectedResource, hideResourceSidebar} = this.props.uiStore
    const { resourceStore } = this.props
    const resource = resourceStore.resources[selectedResource] || {}
    const Resource = resourceToComponent[selectedResource]
    if (!selectedResourceId || !Resource) {
      return null
    }

    const otherProps = {
      [singularResourceIdCamelCased(resource.RESOURCE)]: selectedResourceId
    }
    return (
      <div className='item-detail-sidebar'>
        <Icon name='remove circle' className='hide-sidebar-icon'
              onClick={() => hideResourceSidebar()}/>
        <div className='item-detail-body'>
          <Resource {...otherProps} />
        </div>
      </div>
    )

  }

  render() {
    const { thisPage } = this.props
    return (
      <div>
        <div className="sidebar-fixed">
          <div className="logo">
            <p style={{textAlign: 'center'}}>SK</p>
          </div>
          <Divider/>
          <div className="sidebar-menu">
            <Menu icon='labeled' size='tiny' id="sidebar-menu" inverted vertical borderless fluid>

              <Menu.Item as={Link} to="/directory" id="sidebar-button" name='directory' active={thisPage === '/directory'}>
                <Icon name='address book outline'/>
                Directory
              </Menu.Item>

              <Menu.Item as={Link} to="/script" id="sidebar-button" name='script' active={thisPage === '/script'}>
                <Icon name='book'/>
                Script
              </Menu.Item>

              <Menu.Item as={Link} to="/cast" id="sidebar-button" name='cast' active={thisPage === '/cast'}>
                <Icon name='star'/>
                Cast
              </Menu.Item>

              <Menu.Item as={Link} to='/characters' id="sidebar-button" name='characters' active={thisPage === '/characters'}>
                <Icon name='users'/>
                Characters
              </Menu.Item>

              <Menu.Item as={Link} to='/scenes' id="sidebar-button" name='scenes' active={thisPage === '/scenes'}>
                <Icon name='film'/>
                Scenes
              </Menu.Item>

              <Menu.Item as={Link} to='/costumes' id="sidebar-button" name='costumes' active={thisPage === '/costumes'}>
                <Icon name='shopping bag'/>
                Costumes
              </Menu.Item>

              <Menu.Item as={Link} to='/notes' id="sidebar-button" name='sticky note' active={thisPage === '/notes'}>
                <Icon name='sticky note'/>
                Notes
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='budget' active={thisPage === 'budget'}>
                <Icon name='dollar'/>
                Budget
              </Menu.Item>

              {/*<Menu.Item id="sidebar-button" name='gallery' active={thisPage === 'gallery'}>*/}
                {/*<Icon name='camera retro'/>*/}
                {/*Gallery*/}
              {/*</Menu.Item>*/}

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
        <div className="content-container">
          <div className="body-container">
            {this.props.children}
          </div>
          {this.renderItemSidebar()}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {};

export default Layout
