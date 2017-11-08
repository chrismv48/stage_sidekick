import React from 'react';
import {connect} from 'react-redux';
import './Scenes.scss'

import {Button, Grid, Header, Icon} from 'semantic-ui-react'
import {deleteResource, fetchResource} from "../../api/actions";
import {showModal} from "../Modals/actions";
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";

@connect(state => {
  const {
    dispatch,
    scenes = {},
    characters: {byId: charactersById} = {},
  } = state.resources
  return {
    dispatch,
    scenes,
    charactersById,
  }
})

class Scenes extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(fetchResource('scenes', 'scenes'))
  }

  handleDestroyScene = (event, sceneId) => {
    event.preventDefault()
    this.props.dispatch(deleteResource('scene', `scenes/${sceneId}`))
    this.props.dispatch(fetchResource('scenes', 'scenes'))
  }

  handleEditScene = (event, sceneId) => {
    event.preventDefault()
    this.props.dispatch(showModal('RESOURCE_MODAL', {resourceName: 'scenes', resourceId: sceneId}))
  }

  generateCardExtra = (scene) => {
    return (
      <p
         style={{textAlign: 'center'}}>{`${scene.character_ids && scene.character_ids.length} Characters`}</p>
    )
  }

  render() {
    const {byId: scenesById = {}, allIds: scenesAllIds = []} = this.props.scenes
    const {charactersById, dispatch} = this.props
    return (
        <div className="Scenes">
          <Grid.Row>
            <Grid.Column>
              <Header as="h2" dividing>
                Scenes
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceName: 'scenes', resourceId: null}))} primary>
                <Icon name='add user'/>
                Add Scene
              </Button>
              <CardGroup itemsPerRow={4} resource='characters'>
                {scenesAllIds.map((sceneId, i) => {
                  let scene = scenesById[sceneId]
                  const sceneImageUrl = scene.display_image ? scene.display_image.url : null
                  return (
                    <DisplayCard
                      cardImage={sceneImageUrl}
                      showEditBar
                      header={scene.title}
                      meta={scene.setting}
                      frontDescription={scene.description}
                      extra={this.generateCardExtra(scene)}
                      onEditCallback={(event) => this.handleEditScene(event, sceneId)}
                      onDeleteCallback={(event) => this.handleDestroyScene(event, sceneId)}
                      label='Scene'
                      key={`index-${i}`}
                      index={scene.order_index}
                      link={`scenes/${sceneId}`}
                      flipped={false}
                    />
                  )

                })}
              </CardGroup>
            </Grid.Column>
          </Grid.Row>
        </div>
    );
  }
}

export default Scenes
