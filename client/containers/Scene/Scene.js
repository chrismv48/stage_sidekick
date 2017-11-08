import React from 'react';
import {connect} from 'react-redux';
import './Scene.scss'
import {Dimmer, Grid, Header, Icon, Image, Loader, Tab,} from 'semantic-ui-react'
import {deleteResource, fetchResource} from "../../api/actions"
import * as _ from "lodash";
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import CommentFeed from "../../components/CommentFeed/CommentFeed";
import {showModal} from "../Modals/actions";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {sceneId} = ownProps.params
  const scene = _.get(state.resources, `scenes.byId.${sceneId}`, {})
  const {
    roles: {byId: rolesById} = {},
    characters: {byId: charactersById} = {},
  } = state.resources
  return {
    dispatch,
    scene,
    rolesById,
    charactersById,
  }
})

export class Scene extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('scenes', `scenes/${this.props.params.sceneId}`))
    // TODO: being lazy here and getting all scenes/scenes even though we really only need some
    this.props.dispatch(fetchResource('characters', 'characters'))
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
    const {scene, rolesById, charactersById, dispatch} = this.props
    if (!charactersById || !rolesById || !scene) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <Grid.Column className="Scene">
        <div className="header-container">
          <div className={"header"}>
            <Header as="h1">
          <Image shape='circular' src={_.get(scene, 'display_image.url')}/>
          {' '}{scene.title}
          <Header.Subheader>
            {scene.setting}, {scene.length_in_minutes}m runtime
          </Header.Subheader>
            </Header>
          </div>
          <div className="card-edit-icons">
            <Icon name="edit"
                  color="blue"
                  size='large'
                  onClick={() => dispatch(showModal('RESOURCE_MODAL', {
                    resourceName: 'scenes',
                    resourceId: scene.id,
                  }))}
                  className='edit-icon'
            />
            <Icon name="trash"
                  color="red"
                  size='large'
                  onClick={() => dispatch(deleteResource('scene', `scenes/${scene.id}`))}
                  className='edit-icon'
            />
          </div>
        </div>
        <Header as='h3' dividing>
          Description
        </Header>
        <p>
          {scene.description}
        </p>
        <Header as='h3' dividing>
          Characters
        </Header>

        <CardGroup resource={'scenes'}>
          {scene.character_ids.map((characterId, i) => {
              const character = charactersById[characterId]
              const characterRole = rolesById[character.role_ids[0]]
              const characterImageUrl = character.display_image ? character.display_image.url : null
              return (
                <DisplayCard
                  cardImage={characterImageUrl}
                  header={character.name}
                  meta={`Played by ${characterRole.first_name} ${characterRole.last_name}`}
                  frontDescription={character.description}
                  label='Character'
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
    );
  }
}

export default Scene;
