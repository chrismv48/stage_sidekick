import React from 'react';
import {inject, observer} from "mobx-react";
import {Dimmer, Loader} from "semantic-ui-react";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";
import {computed, observable} from "mobx";

const faker = require('faker');

@inject("resourceStore", "uiStore") @observer
export class SceneCardGroup extends React.Component {

  @computed get scenes() {
    const {sceneIds, resourceStore} = this.props

    if (sceneIds) {
      return resourceStore.scenes.filter(scene => sceneIds.includes(scene.id))
    } else {
      return resourceStore.scenes
    }
  }

  @observable loading = true

  componentDidMount() {

    this.loading = true

    Promise.all([
      this.props.resourceStore.loadScenes()
    ]).then(() => this.loading = false)
  }

  handleDestroyScene = (event, scene) => {
    event.preventDefault()
    scene.destroy()
  }

  handleEditScene = (event, scene) => {
    event.preventDefault()
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'scenes', resourceId: scene.id})
  }

  generateCardExtra = (scene) => {
    return (
      <p style={{textAlign: 'center'}}>
        {`${scene.character_ids && scene.character_ids.length} Characters`}
      </p>
    )
  }

  generateCardMeta = (scene) => {
    if (scene.setting && scene.length_in_minutes) {
      return `${scene.setting}, ${scene.length_in_minutes}m runtime`
    } else if (scene.setting) {
      return scene.setting
    } else if (scene.length_in_minutes) {
      return `${scene.length_in_minutes}m runtime`
    } else {
      return null
    }
  }

  render() {

    if (this.loading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup sortable resource='scenes'>
        {this.scenes.map((scene, i) => {
            return (
              <DisplayCard
                cardImage={scene.primary_image}
                showEditBar
                header={scene.title}
                meta={this.generateCardMeta(scene)}
                frontDescription={scene.description}
                extra={this.generateCardExtra(scene)}
                onEditCallback={(event) => this.handleEditScene(event, scene)}
                onDeleteCallback={(event) => this.handleDestroyScene(event, scene)}
                label='Scene'
                key={`index-${i}`}
                index={scene.order_index}
                link={`scenes/${scene.id}`}
                flipped={false}
              />
            )
          },
        )}
      </CardGroup>
    )
  }
}
