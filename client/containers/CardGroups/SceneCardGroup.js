import React from 'react';
import {connect} from 'react-redux';
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import {showModal} from "../Modals/actions";
import {deleteResource, fetchResource} from "../../api/actions";
import {Dimmer, Loader} from "semantic-ui-react";

const faker = require('faker');

@connect(state => {
  const {
    dispatch,
    scenes = {},
  } = state.resources
  return {
    dispatch,
    scenes,
  }
})

export class SceneCardGroup extends React.Component {

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
      <p style={{textAlign: 'center'}}>\
        {`${scene.character_ids && scene.character_ids.length} Characters`}
      </p>
    )
  }

  render() {
    const {byId: scenesById, allIds: scenesAllIds} = this.props.scenes

    if (!scenesById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup sortable resource='scenes'>
        {scenesAllIds.map((sceneId, i) => {
            let scene = scenesById[sceneId]
            const sceneImageUrl = scene.display_image ? scene.display_image.url : null
            return (
              <DisplayCard
                cardImage={sceneImageUrl}
                showEditBar
                header={scene.title}
                meta={`${scene.setting}, ${scene.length_in_minutes}m runtime`}
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
          },
        )}
      </CardGroup>
    )
  }
}
