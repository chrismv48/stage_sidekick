import React from 'react';
import {Button, Icon} from "semantic-ui-react";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types'
import './MultipleItemLayout.scss'

import {CostumeCardGroup} from "containers/CardGroups/CostumeCardGroup";
import {CostumeItemCardGroup} from "containers/CardGroups/CostumeItemCardGroup";
import {CharacterCardGroup} from "containers/CardGroups/CharacterCardGroup";
import {SceneCardGroup} from "containers/CardGroups/SceneCardGroup";
import {CastCardGroup} from "containers/CardGroups/CastCardGroup";
import {observable} from "mobx";
import ResourceTable from "components/DisplayTable/ResourceTable/ResourceTable";

const RESOURCE_CARD_GROUPS = {
  'characters': CharacterCardGroup,
  'scenes': SceneCardGroup,
  'costumes': CostumeCardGroup,
  'costume_items': CostumeItemCardGroup,
  'actors': CastCardGroup,
}

const RESOURCE_TABLES = {
  'actors': ResourceTable,
  'characters': ResourceTable,
  'costumes': ResourceTable,
  'scenes': ResourceTable,
  'costume_items': ResourceTable
}

@inject("resourceStore", "uiStore") @observer
class MultipleItemLayout extends React.Component {

  handleAddResoureClick = () => {
    const {resource} = this.props
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: resource, resourceId: null})
  }

  renderDisplayMode() {
    const { resource, uiStore: {displayMode} } = this.props
    if (displayMode === 'cards') {
      const ResourceCardGroup = RESOURCE_CARD_GROUPS[resource]
      return (
        <ResourceCardGroup/>
      )
    } else if (displayMode === 'table') {
      const ResourceTable = RESOURCE_TABLES[resource]
      return (
        <ResourceTable resource={resource} />
      )
    }
  }

  render() {
    const {resourceLabel, resource, hideAddResourceButton} = this.props

    return (
      <div className='MultipleItemLayout'>
        {!hideAddResourceButton &&
        <Button onClick={this.handleAddResoureClick} primary>
          <Icon name='add user'/>
          Add {resourceLabel}
        </Button>}

        <div className='body-container'>
          {this.renderDisplayMode()}
        </div>
      </div>
    )
  }
}

MultipleItemLayout.propTypes = {
  resource: PropTypes.string.isRequired,
  resourceLabel: PropTypes.string,
  hideAddResourceButton: PropTypes.bool,
};

MultipleItemLayout.defaultProps = {
  hideAddResourceButton: false
}

export default MultipleItemLayout
