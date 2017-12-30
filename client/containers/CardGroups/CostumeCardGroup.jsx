import React from 'react';
import {inject, observer} from "mobx-react";
import {Dimmer, Loader} from "semantic-ui-react";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";

@inject("resourceStore", "uiStore") @observer
export class CostumeCardGroup extends React.Component {

  componentDidMount() {
    this.props.resourceStore.loadCostumes()
  }

  handleEditCostume = (event, costume) => {
    event.preventDefault()
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'costumes', resourceId: costume.id})
  }

  handleDestroyCostume = (event, costume) => {
    event.preventDefault()
    costume.destroy()
  }

  generateCardExtra = (costume) => {
    const num_scenes = costume.scene_ids.length
    const num_characters = costume.character_ids.length
    let sentence = ''
    if (num_scenes > 0 && num_characters > 0) {
      sentence = `Worn in ${num_scenes} ${num_scenes > 1 ? 'scenes' : 'scene'} by ${num_characters} ${num_characters > 1 ? 'characters' : 'character'}`
    }
    else if (num_scenes > 0) {
      sentence = `Worn in ${num_scenes} ${num_scenes > 1 ? 'scenes' : 'scene'}`
    }
    else if (num_characters > 0) {
      sentence = `Worn by ${num_characters} ${num_characters > 1 ? 'characters' : 'character'}`
    }
    else {
      sentence = ''
    }
    return (
      <p style={{textAlign: 'center'}}>{sentence}</p>
    )
  }

  render() {
    const {costumes, isLoading} = this.props.resourceStore
    if (isLoading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup resource='costumes'>
        {costumes.map((costume, i) => {
            return (
              <DisplayCard
                cardImage={costume.main_image}
                showEditBar
                header={costume.title}
                frontDescription={costume.description}
                extra={this.generateCardExtra(costume)}
                onEditCallback={(event) => this.handleEditCostume(event, costume)}
                onDeleteCallback={(event) => this.handleDestroyCostume(event, costume)}
                label='Costume'
                key={`index-${i}`}
                link={`costumes/${costume.id}`}
                sortable={false}
                index={i}
              />
            )}
        )}
      </CardGroup>
    )
  }
}