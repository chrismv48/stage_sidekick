import React from 'react';
import {Button, Icon, Segment} from "semantic-ui-react";
import {inject, observer} from "mobx-react";
import {CostumeCardGroup} from "containers/CardGroups/CostumeCardGroup";
import {CostumeItemCardGroup} from "containers/CardGroups/CostumeItemCardGroup";
import {CharacterCardGroup} from "containers/CardGroups/CharacterCardGroup";
import {SceneCardGroup} from "containers/CardGroups/SceneCardGroup";
import {CastCardGroup} from "containers/CardGroups/CastCardGroup";

const RESOURCE_CARD_GROUPS = {
  'characters': CharacterCardGroup,
  'scenes': SceneCardGroup,
  'costumes': CostumeCardGroup,
  'costume_items': CostumeItemCardGroup,
  'actors': CastCardGroup,
}

@inject("resourceStore", "uiStore") @observer
class MultipleItemLayout extends React.Component {

  handleAddResoureClick = () => {
    const {resource} = this.props
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: resource, resourceId: null})
  }

  render() {
    const {resourceLabel, resource, hideAddResourceButton} = this.props
    const ResourceCardGroup = RESOURCE_CARD_GROUPS[resource]
    return (
      <div>
        {!hideAddResourceButton &&
        <Button onClick={this.handleAddResoureClick} primary>
          <Icon name='add user'/>
          Add {resourceLabel}
        </Button>
        }
        <Segment basic style={{paddingLeft: 0}}>
          <ResourceCardGroup/>
        </Segment>
      </div>
    );
  }
}

MultipleItemLayout.propTypes = {};

export default MultipleItemLayout
