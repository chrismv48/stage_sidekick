import React from 'react';
import {Button, Icon, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import {showModal} from "../../containers/Modals/actions";
import {CostumeCardGroup} from "../../containers/CardGroups/CostumeCardGroup";
import {CostumeItemCardGroup} from "../../containers/CardGroups/CostumeItemCardGroup";
import {CharacterCardGroup} from "../../containers/CardGroups/CharacterCardGroup";
import {SceneCardGroup} from "../../containers/CardGroups/SceneCardGroup";

const RESOURCE_CARD_GROUPS = {
  'characters': CharacterCardGroup,
  'scenes': SceneCardGroup,
  'costumes': CostumeCardGroup,
  'costume_items': CostumeItemCardGroup,
}

@connect((state) => {
  const {dispatch} = state
  return {
    dispatch
  }
})

class MultipleItemLayout extends React.Component { // eslint-disable-line react/prefer-stateless-function

  handleAddResoureClick = () => {
    const {dispatch, resource} = this.props
    dispatch(showModal('RESOURCE_MODAL', {resourceName: resource, resourceId: null}))
  }

  render() {
    const {resourceLabel, resource} = this.props
    const ResourceCardGroup = RESOURCE_CARD_GROUPS[resource]
    return (
      <div>
        <Button onClick={this.handleAddResoureClick} primary>
          <Icon name='add user'/>
          Add {resourceLabel}
        </Button>
        <Segment basic style={{paddingLeft: 0}}>
          <ResourceCardGroup/>
        </Segment>
      </div>
    );
  }
}

MultipleItemLayout.propTypes = {};

export default MultipleItemLayout
