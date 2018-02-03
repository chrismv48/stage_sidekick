import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class CostumeItemCardGroup extends React.Component {

  @computed get costume_items() {
    const {costumeItemIds, resourceStore} = this.props

    if (costumeItemIds) {
      return resourceStore.costume_items.filter(scene => costumeItemIds.includes(scene.id))
    } else {
      return resourceStore.costume_items
    }
  }

  @observable loading = true

  componentDidMount() {
    this.loading = true

    Promise.all([
      this.props.resourceStore.loadCostumeItems()
    ]).then(() => this.loading = false)
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
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    return (
      <CardGroup resource={'costume_items'}>
        {this.costume_items.map((costumeItem, i) => {
            return (
              <DisplayCard
                cardImage={costumeItem.cardImage}
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
