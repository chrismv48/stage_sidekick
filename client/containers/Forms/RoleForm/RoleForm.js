/*
 *
 * Role
 *
 */

import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './RoleForm.scss'
import * as _ from "lodash";
import {fetchResource, updateResourceFields} from "api/actions";
import ImageUpload from "components/ImageUpload/ImageUpload";

const employmentTypes = [
  {
    text: 'Full-time',
    value: 'Full-time',
  },
  {
    text: 'Part-time',
    value: 'Part-time',
  },
  {
    text: 'Contractor',
    value: 'Contractor',
  },
]

@connect((state, ownProps) => {
  const {dispatch} = state
  const {roleId} = ownProps
  const {
    roles = {},
  } = state.resources

  const role = _.get(roles, `byId.${roleId}`, {})
  const roleStaging = _.get(roles, `staging.${roleId}`, {})
  const loading = roles.loading

  return {
    dispatch,
    role,
    roleStaging,
    loading,
  }
})

export class RoleForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const {roleId} = this.props
    if (roleId) {
      this.props.dispatch(fetchResource('roles', `roles/${roleId}`))
    }
  }

  render() {
    const {roleStaging, role, dispatch, loading, roleId} = this.props
    const roleImageUrl = roleStaging['avatar'] || _.get(role, 'avatar.url')
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <ImageUpload currentImage={roleImageUrl}
                       handleImageChange={(imageUrl) => dispatch(updateResourceFields('roles', 'avatar', imageUrl, roleId))}/>
          <Form.Field>
            <label>First Name</label>
            <input
              value={_.isUndefined(roleStaging['first_name']) ? role.first_name : roleStaging['first_name'] || ""}
              onChange={(e) => dispatch(updateResourceFields('roles', 'first_name', e.target.value, roleId))}/>
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input
              value={_.isUndefined(roleStaging['last_name']) ? role.last_name : roleStaging['last_name'] || ""}
              onChange={(e) => dispatch(updateResourceFields('roles', 'last_name', e.target.value, roleId))}/>
          </Form.Field>
          <Form.Field>
            <label>Title</label>
            <input
              value={_.isUndefined(roleStaging['title']) ? role.title : roleStaging['title'] || ""}
              onChange={(e) => dispatch(updateResourceFields('roles', 'title', e.target.value, roleId))}/>
          </Form.Field>
          <Form.Field>
            <label>Department</label>
            <input
              value={_.isUndefined(roleStaging['department']) ? role.department : roleStaging['department'] || ""}
              onChange={(e) => dispatch(updateResourceFields('roles', 'department', e.target.value, roleId))}/>
          </Form.Field>
          <Form.Field>
            <label>Employment Type</label>
            <Dropdown
              placeholder='Select Employment Type' selection
              options={employmentTypes}
              onChange={(event, data) => dispatch(updateResourceFields('roles', 'role_type', data.value, roleId))}
              value={roleStaging['role_type'] || role.role_type || ''}
            />
          </Form.Field>
        </Form>
      </Segment>
    );
  }
}

RoleForm.propTypes = {};


export default RoleForm
