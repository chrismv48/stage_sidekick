import React from 'react';
import PropTypes from 'prop-types'
import './EditIcon.scss'
import {inject} from "mobx-react";
import {Icon} from "semantic-ui-react";

@inject("uiStore")
class EditIcon extends React.Component {
  render() {
    const {resource, resourceId, uiStore} = this.props
    return (
      <Icon
        name='edit'
        className='edit-section-label'
        size='tiny'
        onClick={() => uiStore.showModal('RESOURCE_MODAL', {
          resourceName: resource,
          resourceId: resourceId
        })}
      />
    )
  }
}


EditIcon.propTypes = {
  resource: PropTypes.string.isRequired,
  resourceId: PropTypes.number.isRequired
};

export default EditIcon
