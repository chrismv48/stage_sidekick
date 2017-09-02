import {hideModal} from "./actions";
import {Button, Header, Modal} from "semantic-ui-react";
import {RoleForm} from "../RoleForm/RoleForm";
import * as React from "react";
import * as _ from "lodash";
import {connect} from "react-redux";
import {createResource, modifyResource} from "../../api/actions";

@connect((state, ownProps) => {
  const {
    dispatch,
    roles = {}
  } = state.entities
  const roleStaged = _.get(roles, `staging.${ownProps.roleId}`, {})
  const success = roles.success
  return {
    dispatch,
    roleStaged,
    success
  }
})

export default class RoleModal extends React.Component {

  componentWillReceiveProps(nextProps) {
    const {roleStaged: newRoleStaged} = nextProps
    const { roleStaged, success, dispatch } = this.props
    if (success && !_.isEmpty(roleStaged) && _.isEmpty(newRoleStaged)) { dispatch(hideModal()) }
  }

  handleRoleSubmit = () => {
    const { roleStaged, roleId, dispatch } = this.props
    if (roleId) {
      dispatch(modifyResource('roles', `roles/${roleId}`, roleStaged))
    }
    else {
      dispatch(createResource('roles', 'roles', roleStaged))
    }
  }

  render() {
    const {roleId, roleStaged, dispatch} = this.props

    let iconName = 'add user'
    let modalHeading = 'Add New Role'
    if (roleId) {
      iconName = 'edit'
      modalHeading = 'Edit Role'
    }

    return (
      <Modal
        open={true}
        onClose={() => dispatch(hideModal())}
        closeIcon='close'>
        <Header icon={iconName} content={modalHeading}/>
        <Modal.Content>
          <RoleForm roleId={roleId}/>
        </Modal.Content>
        <Modal.Actions>
          <Button primary
                  onClick={this.handleRoleSubmit}
                  disabled={_.isEmpty(roleStaged)}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
