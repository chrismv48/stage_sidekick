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
import messages from './messages';

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
      <h1>
        {/*<FormattedMessage {...messages.header} />*/}
        {this.state.greeting}
      </h1>
    );
  }
}
