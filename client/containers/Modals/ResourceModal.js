import {hideModal} from "./actions";
import {Button, Header, Modal} from "semantic-ui-react";
import * as React from "react";
import * as _ from "lodash";
import {connect} from "react-redux";
import {createResource, modifyResource} from "../../api/actions";
import CharacterForm from "../Forms/CharacterForm/CharacterForm";
import SceneForm from "../Forms/SceneForm/SceneForm";
import RoleForm from "../Forms/RoleForm/RoleForm";
import {swapPlurality} from "../../helpers";
import CostumeForm from "../Forms/CostumeForm/CostumeForm";

const RESOURCE_FORM_COMPONENTS = {
  'characters': CharacterForm,
  'scenes': SceneForm,
  'roles': RoleForm,
  'costumes': CostumeForm
}

@connect((state, ownProps) => {
  const { resourceType, resourceId } = ownProps
  const { dispatch } = state
  const resource = _.get(state, `resources.${resourceType}`, {})
  const resourceStaged = _.get(resource, `staging.${resourceId}`, {})
  const { success: resourceSuccess } = resource

  return {
    dispatch,
    resourceStaged,
    resourceSuccess
  }
})

export default class ResourceModal extends React.Component {

  componentWillReceiveProps(nextProps) {
    const {resourceStaged: newResourceStaged} = nextProps
    const { resourceStaged, resourceSuccess, dispatch } = this.props
    if (resourceSuccess && !_.isEmpty(resourceStaged) && _.isEmpty(newResourceStaged)) { dispatch(hideModal()) }
  }

  handleResourceSubmit = () => {
    const { resourceStaged, resourceId, resourceType, dispatch } = this.props
    if (resourceId) {
      dispatch(modifyResource(resourceType, `${resourceType}/${resourceId}`, resourceStaged))
    }
    else {
      dispatch(createResource(resourceType, resourceType, resourceStaged))
    }
  }

  render() {
    let {resourceStaged, resourceType, dispatch, resourceId, ...otherProps } = this.props

    const singularizedResource = swapPlurality(resourceType)

    let iconName = 'add user'
    let modalHeading = `Add ${singularizedResource}`
    if (resourceId) {
      iconName = 'edit'
      modalHeading = `Edit ${singularizedResource}`
    }
    otherProps[`${singularizedResource}Id`] = resourceId

    const ResourceForm = RESOURCE_FORM_COMPONENTS[resourceType]
    return (
      <Modal
        open={true}
        onClose={() => dispatch(hideModal())}
        closeIcon='close'>
        <Header icon={iconName} content={modalHeading}/>
        <Modal.Content>
          <ResourceForm {...otherProps} />
        </Modal.Content>
        <Modal.Actions>
          <Button primary
                  onClick={this.handleResourceSubmit}
                  disabled={_.isEmpty(resourceStaged)}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
