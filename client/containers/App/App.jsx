/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, {Component} from 'react';
import {Provider} from "mobx-react";
import {Route} from "react-router-dom";
import DevTools from 'mobx-react-devtools'
import RootModal from 'containers/Modals/RootModal'

import Layout from "components/Layout/Layout";
import Dashboard from "containers/Dashboard/Dashboard";
import Characters from "containers/Characters/Characters";
import Scenes from "containers/Scenes/Scenes";
import Costumes from "containers/Costumes/Costumes";
import RootStore from "stores/rootStore";

import Costume from "containers/Costume/Costume";
import Character from "containers/Character/Character";
import Scene from "containers/Scene/Scene";
import Directory from "containers/Directory/Directory";
import Actors from "containers/Actors/Actors";

const rootStore = new RootStore()

export default class App extends Component {

  componentDidMount() {
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
        console.log(data.greeting)
      })
  }

  render() {
    return (
      <Provider {...rootStore}>
        <Layout thisPage={this.props.location.pathname}>
          <DevTools />
          <RootModal/>
          <Route exact path='/' name='dashboard' component={Dashboard}/>
          <Route exact path='/cast' component={Actors}/>
          <Route exact path='/characters' component={Characters}/>
          <Route exact path='/scenes' component={Scenes}/>
          <Route exact path='/costumes' component={Costumes}/>
          <Route exact path='/directory' component={Directory}/>
          <Route exact path='/costumes/:costumeId' component={Costume}/>
          <Route exact path='/characters/:characterId' component={Character}/>
          <Route exact path='/scenes/:sceneId' component={Scene}/>
        </Layout>
      </Provider>
    );
  }
}
