import React, {Component} from 'react';
import {Provider} from "mobx-react";
import {Route} from "react-router-dom";
import DevTools from 'mobx-react-devtools'
import RootModal from 'components/Modals/RootModal'

import './App.scss'

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
import Actor from "containers/Actor/Actor";
import Script from "containers/Script/Script";
import Notes from "containers/Notes/Notes";
import CostumeItem from "containers/CostumeItem/CostumeItem";
import ScriptImport from "containers/ScriptImport/ScriptImport";

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
      })
  }

  render() {
    return (
      <Provider {...rootStore}>
        <Layout thisPage={this.props.location.pathname}>
          {process.env.NODE_ENV === 'development' ? <DevTools /> : null}
          <RootModal/>
          <Route exact path='/' name='dashboard' component={Dashboard}/>
          <Route exact path='/cast' component={Actors}/>
          <Route exact path='/notes' component={Notes}/>
          <Route exact path='/cast/:actorId' component={Actor}/>
          <Route exact path='/characters' component={Characters}/>
          <Route exact path='/scenes' component={Scenes}/>
          <Route exact path='/costumes' component={Costumes}/>
          <Route exact path='/directory' component={Directory}/>
          <Route exact path='/script' component={Script}/>
          <Route exact path='/script_import' component={ScriptImport}/>
          <Route exact path='/costumes/:costumeId' component={Costume}/>
          <Route exact path='/characters/:characterId' component={Character}/>
          <Route exact path='/scenes/:sceneId' component={Scene}/>
          <Route exact path='/costume_items/:costumeItemId' component={CostumeItem}/>
        </Layout>
      </Provider>
    );
  }
}
