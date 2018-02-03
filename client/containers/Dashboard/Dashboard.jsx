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

import React, {Component} from 'react';
import './Dashboard.scss'
import {Container, Grid} from 'semantic-ui-react'

export default class Dashboard extends Component {

  render() {
    return (
      <Grid className="Dashboard">
        <Grid.Row>
          <Container fluid>
            I'm a dashboard!
          </Container>
        </Grid.Row>
      </Grid>
    );
  }
}
