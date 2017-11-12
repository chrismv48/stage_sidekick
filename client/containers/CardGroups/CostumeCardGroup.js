import React from 'react';
import {connect} from 'react-redux';
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import {showModal} from "../Modals/actions";
import {deleteResource, fetchResource} from "../../api/actions";
import {Dimmer, Loader} from "semantic-ui-react";

@connect(state => {
  const {dispatch} = state
  const {
    costumes = {},
  } = state.resources
  return {
    dispatch,
    costumes,
  }
})

export class CostumeCardGroup extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('costumes', 'costumes'))
  }

  handleEditCostume = (event, costumeId) => {
    event.preventDefault()
    this.props.dispatch(showModal('RESOURCE_MODAL', {resourceName: 'costumes', resourceId: costumeId}))
  }

  handleDestroyCostume = (event, costumeId) => {
    event.preventDefault()
    this.props.dispatch(deleteResource('costume', `costumes/${costumeId}`))
    this.props.dispatch(fetchResource('costumes', 'costumes'))
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
    const {byId: costumesById, allIds: costumesAllIds} = this.props.costumes

    if (!costumesById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup resource={'costumes'}>
        {costumesAllIds.map((costumeId, i) => {
            let costume = costumesById[costumeId]
            const costumeImageUrl = costume.display_image ? costume.display_image.url : null
            return (
              <DisplayCard
                cardImage={costumeImageUrl}
                showEditBar
                header={costume.title}
                frontDescription={costume.description}
                extra={this.generateCardExtra(costume)}
                onEditCallback={(event) => this.handleEditCostume(event, costumeId)}
                onDeleteCallback={(event) => this.handleDestroyCostume(event, costumeId)}
                label='Costume'
                key={`index-${i}`}
                link={`costumes/${costumeId}`}
                sortable={false}
                index={i}
              />
            )}
        )}
      </CardGroup>
    )
  }
}
