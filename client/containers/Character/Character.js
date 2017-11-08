import React from 'react';
import {connect} from 'react-redux';
import './Character.scss'
import {Dimmer, Grid, Header, Image, Loader, Segment, Tab,} from 'semantic-ui-react'
import {fetchResource} from "../../api/actions"
import * as _ from "lodash";
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import CommentFeed from "../../components/CommentFeed/CommentFeed";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {characterId} = ownProps.params
  const character = _.get(state.resources, `characters.byId.${characterId}`, {})
  const {
    characters: {byId: charactersById} = {},
    roles: {byId: rolesById} = {},
    scenes: {byId: scenesById} = {},
  } = state.resources
  return {
    dispatch,
    character,
    charactersById,
    scenesById,
    rolesById,
  }
})

export class Character extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('characters', `characters/${this.props.params.characterId}`))
    // TODO: being lazy here and getting all characters/scenes even though we really only need some
    this.props.dispatch(fetchResource('scenes', 'scenes'))
    this.props.dispatch(fetchResource('roles', 'roles'))
  }

  renderActivitySection() {
    const panes = [
      {menuItem: 'Comments', render: () => <Tab.Pane><CommentFeed/></Tab.Pane>},
      {menuItem: 'Activity', render: () => <Tab.Pane><ActivityFeed/></Tab.Pane>},
    ]

    return (
      <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
    )
  }

  render() {
    const {character, charactersById, rolesById, scenesById} = this.props
    if (!charactersById || !rolesById || !scenesById) {
      return (
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }
    const characterRole = _.isEmpty(character.role_ids) ? {} : rolesById[character.role_ids[0]]

    return (
      <Grid className="character">
        <Grid.Column className="character">
          <Header as="h1">
            <Image shape='circular' src={_.get(character, 'display_image.url')}/>
            {' '}{character.name}
            <Header.Subheader>
              Played by <a href="#">{`${characterRole.first_name} ${characterRole.last_name}`}</a>
            </Header.Subheader>
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <p>
            {character.description}
          </p>
          <Header as='h3' dividing>
            Character Scenes
          </Header>

          <CardGroup resource={'scenes'}>
            {character.scene_ids.map((sceneId, i) => {
                let scene = scenesById[sceneId]
                const sceneImageUrl = scene.display_image ? scene.display_image.url : null
                return (
                  <DisplayCard
                    cardImage={sceneImageUrl}
                    header={scene.title}
                    meta={scene.setting}
                    frontDescription={scene.description}
                    label='Scene'
                    key={`index-${i}`}
                    sortable={false}
                    index={i}
                  />
                )
              },
            )}
          </CardGroup>

          <Header as='h3' dividing>
            Activity
          </Header>
          {this.renderActivitySection()}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Character;
