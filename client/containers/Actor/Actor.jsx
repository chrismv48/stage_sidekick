import React from 'react';
import './Actor.scss'
import {Dimmer, Grid, Header, Image, Loader, Segment, Tab,} from 'semantic-ui-react'
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {find, get} from 'lodash'
import {CharacterCardGroup} from "containers/CardGroups/CharacterCardGroup";

@inject("resourceStore", "uiStore") @observer
export class Actor extends React.Component {

  @observable loading = true

  @computed get actorId() {
    return parseInt(this.props.match.params.actorId)
  }

  @computed get actor() {
    debugger
    return this.props.resourceStore.actors.find(actor => actor.id === this.actorId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadActors(this.actorId),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
    ]).then(() => this.loading = false)
  }

  @computed get renderActivitySection() {
    const panes = [
      {menuItem: 'Comments', render: () => <Tab.Pane><CommentFeed/></Tab.Pane>},
      {menuItem: 'Activity', render: () => <Tab.Pane><ActivityFeed/></Tab.Pane>},
    ]

    return (
      <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
    )
  }

  render() {
    const { characters, scenes } = this.props.resourceStore
    if (this.loading) {
      return (
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }

    return (
      <Grid className="Actor">
        <Grid.Column>
          <Header as="h1">
            <Image shape='circular' src={this.actor.main_image}/>
            {this.actor.fullName}
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <p>
            {this.actor.description}
          </p>
          <Header as='h3' dividing>
            Characters
          </Header>
          <CharacterCardGroup characterIds={this.actor.character_ids} />
          <Header as='h3' dividing>
            Activity
          </Header>
          {this.renderActivitySection}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Actor;
