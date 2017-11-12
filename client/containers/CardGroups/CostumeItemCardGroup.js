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
    costume_items = {},
  } = state.resources
  return {
    dispatch,
    costume_items,
  }
})

export class CostumeItemCardGroup extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('costume_items', 'costume_items'))
  }

  handleEditCostumeItem = (event, costumeItemId) => {
    event.preventDefault()
    this.props.dispatch(showModal('RESOURCE_MODAL', {resourceName: 'costume_items', resourceId: costumeItemId}))
  }

  handleDestroyCostumeItem = (event, costumeItemId) => {
    event.preventDefault()
    this.props.dispatch(deleteResource('costume_item', `costume_items/${costumeItemId}`))
    this.props.dispatch(fetchResource('costume_items', 'costume_items'))
  }

  render() {
    const {byId: costumeItemsById = {}, allIds: costumeItemsAllIds = []} = this.props.costume_items

    if (!costumeItemsById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup resource={'costume_items'}>
        {costumeItemsAllIds.map((costumeItemId, i) => {
            let costumeItem = costumeItemsById[costumeItemId]
            const costumeImageUrl = costumeItem.display_image ? costumeItem.display_image.url : null
            return (
              <DisplayCard
                cardImage={costumeImageUrl}
                showEditBar
                header={costumeItem.title}
                frontDescription={costumeItem.description}
                extra={costumeItem.item_type}
                onEditCallback={(event) => this.handleEditCostumeItem(event, costumeItemId)}
                onDeleteCallback={(event) => this.handleDestroyCostumeItem(event, costumeItemId)}
                label='Costume Item'
                key={`index-${i}`}
                sortable={false}
                index={i}
              />
            )
          },
        )}
      </CardGroup>
    )
  }
}
