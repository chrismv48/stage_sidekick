import React, {Component} from 'react';
import './Dashboard.scss'
import {Accordion, Grid, Progress} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {observable} from 'mobx'
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export default class Dashboard extends Component {

  @observable loading = true

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadSetupAlerts(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes()
    ]).then(() => this.loading = false)
  }

  renderAlert(alert) {
    const {scenes, characters} = this.props.resourceStore
    switch (alert.alert) {
      case "scenes_without_characters":
        debugger
        return {
          title: `Scenes without characters (${alert.results.length})`,
          content: <ul>{alert.results.map((result, i) => {
            return (<li key={i}><a href={`/scenes/${result.id}`}>{result.title}</a></li>)
          })}</ul>,
          key: alert.alert
        }
      case "characters_without_scenes":
        return {
          title: `Characters without scenes (${alert.results.length})`,
          content: alert.results.map((result, i) => {
            return <div key={i}><a href={`/characters/${result.id}`}>{result.name}</a></div>
          }),
          key: alert.alert
        }
      case "character_scenes_without_costumes":

        return {
          title: `Characters without scenes (${alert.results.length})`,
          content: alert.results.map((result, i) => {
            const scene = scenes.find(scene => scene.id === result.scene_id)
            const character = characters.find(character => character.id === result.character_id)
            return (
              <div key={i}>
                <a href={`/characters/${character.id}`}>{result.name}</a> in scene <a
                href={`/scenes/${scene.id}`}>{scene.title}</a>
              </div>
            )
          }),
          key: alert.alert
        }

      case "costumes_without_character_scenes":
        return {
          title: `Costumes without character scenes (${alert.results.length})`,
          content: alert.results.map((result, i) => {
            return <div key={i}><a href={`/costumes/${result.id}`}>{result.title}</a></div>
          }),
          key: alert.alert
        }

      case "costumes_without_costume_items":
        return {
          title: `Costumes without costume items (${alert.results.length})`,
          content: alert.results.map((result, i) => {
            return <div key={i}><a href={`/costumes/${result.id}`}>{result.title}</a></div>
          }),
          key: alert.alert
        }

      case "costume_items_without_costumes":
        return {
          title: `Costume Items without costumes (${alert.results.length})`,
          content: alert.results.map((result, i) => {
            return <div key={i}><a href={`/costume_items/${result.id}`}>{result.title}</a></div>
          }),
          key: alert.alert
        }
    }
  }

  calculateProgress(setupAlerts) {
    let affected_count = 0
    let total_count = 0

    for (let alert of setupAlerts) {
      affected_count += alert.results.length
      total_count += alert.total_count
    }
    return [affected_count, total_count]
  }

  render() {
    const {setupAlerts} = this.props.resourceStore
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    const panels = setupAlerts.map(alert => this.renderAlert(alert))
    const [affected_count, total_count] = this.calculateProgress(setupAlerts)
    debugger
    return (
      <Grid className="Dashboard">
        <Grid.Column>
          <h4>Setup Progress</h4>
          <div>
            <Progress
              percent={parseInt((total_count - affected_count) / total_count * 100)}
              color='blue'
              progress='percent'
            />
          </div>
          <div>
            <Accordion panels={panels} exclusive={false} />
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}
