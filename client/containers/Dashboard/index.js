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
import './Dashboard.scss'
import {Grid, Container, Menu, Icon, Header, Divider, Dropdown} from 'semantic-ui-react'

export default class Dashboard extends Component { //React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  state = {
    thisPage: null
  };

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

  handleItemClick = (e, { name }) => this.setState({ thisPage: name })

  render() {
    const { thisPage } = this.state
    return (
      <div>
        <div className="sidebar-fixed">
          <div className="logo">
            <p style={{textAlign: 'center'}}>LOGO</p>
          </div>
          <Divider/>
          <div className="sidebar-menu">
            <Menu icon='labeled' size='tiny' id="sidebar-menu" inverted vertical borderless fluid>

              <Menu.Item id="sidebar-button" name='directory' active={thisPage==='directory'} onClick={this.handleItemClick}>
                <Icon name='address book outline'/>
                Directory
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='scenes' active={thisPage==='scenes'} onClick={this.handleItemClick}>
                <Icon name='film'/>
                Scenes
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='budget' active={thisPage==='budget'} onClick={this.handleItemClick}>
                <Icon name='dollar'/>
                Budget
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='gallery' active={thisPage==='gallery'} onClick={this.handleItemClick}>
                <Icon name='camera retro'/>
                Gallery
              </Menu.Item>

              <Menu.Item id="sidebar-button" name='costumes' active={thisPage==='costumes'} onClick={this.handleItemClick}>
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
              <Menu.Item name='home' active={thisPage==='gallery'} onClick={this.handleItemClick} />
              <Menu.Item name='messages' active={thisPage==='gallery'} onClick={this.handleItemClick} />
              <Menu.Item name='friends' active={thisPage === 'friends'} onClick={this.handleItemClick} />
            </Menu>
          </div>
          <Grid id="grid-layout">
            <Grid.Row>
              <Container fluid>
                Content goes here
              </Container>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}
