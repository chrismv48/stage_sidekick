import React from 'react';
import {inject, observer} from "mobx-react";
import {Dimmer, Loader} from "semantic-ui-react";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";

@inject("resourceStore", "uiStore") @observer
export class CostumeItemCardGroup extends React.Component {

  componentDidMount() {
    this.props.resourceStore.loadCostumeItems()
  }

  handleEditCostumeItem = (event, costumeItem) => {
    event.preventDefault()
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'costume_items', resourceId: costumeItem.id})
  }

  handleDestroyCostumeItem = (event, costumeItem) => {
    event.preventDefault()
    costumeItem.destroy()
  }

  render() {
    const {costume_items, isLoading} = this.props.resourceStore
    if (isLoading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup resource={'costume_items'}>
        {costume_items.map((costumeItem, i) => {
            const costumeImageUrl = costumeItem.display_image ? costumeItem.display_image.url : null
            return (
              <DisplayCard
                cardImage={costumeImageUrl}
                showEditBar
                header={costumeItem.title}
                frontDescription={costumeItem.description}
                extra={costumeItem.item_type}
                onEditCallback={(event) => this.handleEditCostumeItem(event, costumeItem)}
                onDeleteCallback={(event) => this.handleDestroyCostumeItem(event, costumeItem)}
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
