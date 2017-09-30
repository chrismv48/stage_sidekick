import {hideModal} from "./actions";
import {Button, Header, Modal} from "semantic-ui-react";
import * as React from "react";
import * as _ from "lodash";
import {connect} from "react-redux";
import {createResource, modifyResource} from "../../api/actions";
import {swapPlurality} from "../../helpers";
import CostumeForm from "../Forms/CostumeForm/CostumeForm";
import ResourceForm from "../Forms/ResourceForm/ResourceForm";

const RESOURCE_FORM_COMPONENTS = {
  'characters': ResourceForm,
  'scenes': ResourceForm,
  'roles': ResourceForm,
  'costumes': CostumeForm,
  'costume_items': ResourceForm
}

@connect((state, ownProps) => {
  const { resourceName, resourceId } = ownProps
  const { dispatch } = state
  const resource = _.get(state, `resources.${resourceName}`, {})
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
    const { resourceStaged, resourceId, resourceName, dispatch } = this.props
    if (resourceId) {
      dispatch(modifyResource(resourceName, `${resourceName}/${resourceId}`, resourceStaged))
    }
    else {
      dispatch(createResource(resourceName, resourceName, resourceStaged))
    }
  }

  render() {
    let {resourceStaged, resourceName, dispatch, resourceId, ...otherProps } = this.props

    const singularizedResource = swapPlurality(resourceName)

    let iconName = 'add user'
    let modalHeading = `Add ${singularizedResource.replace('_', ' ')}`
    if (resourceId) {
      iconName = 'edit'
      modalHeading = `Edit ${singularizedResource.replace('_', ' ')}`
    }
    otherProps[`${_.camelCase(singularizedResource)}Id`] = resourceId

    const ResourceForm = RESOURCE_FORM_COMPONENTS[resourceName]
    return (
      <Modal
        open={true}
        onClose={() => dispatch(hideModal())}
        closeIcon='close'>
        <Header icon={iconName} content={modalHeading}/>
        <Modal.Content>
          <ResourceForm {...otherProps} resourceId={resourceId} resourceName={resourceName} />
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
