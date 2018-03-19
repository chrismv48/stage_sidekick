import {Button, Header, Modal} from "semantic-ui-react";
import React from "react";
import {inject, observer} from "mobx-react";
import {assign, isEmpty} from "lodash";
import CostumeForm from "components/Forms/CostumeForm/CostumeForm";
import {computed} from "mobx";
import ResourceForm from "components/Forms/ResourceForm/ResourceForm";

const RESOURCE_FORM_COMPONENTS = {
  'characters': ResourceForm,
  'scenes': ResourceForm,
  'roles': ResourceForm,
  'costumes': CostumeForm,
  'costume_items': ResourceForm,
  'actors': ResourceForm,
  'notes': ResourceForm
}

@inject('resourceStore', 'uiStore') @observer
export default class ResourceModal extends React.Component {

  componentWillMount() {
    const {initializeWith} = this.props
    const resourceStaged = this.resourceStaged
    assign(resourceStaged, initializeWith)
  }

  @computed get resourceStaged() {
    const {resourceName, resourceId} = this.props
    return this.props.resourceStore.getStagedResource(resourceName, resourceId)
  }

  handleResourceSubmit = () => {
    const {uiStore} = this.props
    this.resourceStaged.save()
    uiStore.hideModal()
  }

  handleCloseModal = () => {
    const {uiStore} = this.props

    uiStore.hideModal()
    this.resourceStaged.revert()  // exited without saving, revert to original values
  }

  render() {
    let {resourceStore, resourceName, resourceId, ...otherProps} = this.props
    let iconName = 'add user'
    const resourceStaged = resourceStore.getStagedResource(resourceName, resourceId)
    const singularizedResource = resourceStaged.resourceSingular
    let modalHeading = `Add ${singularizedResource}`
    if (resourceId) {
      iconName = 'edit'
      modalHeading = `Edit ${singularizedResource}`
    }

    // Do this so we get resourceId personalized for custom forms like CostumeForm
    otherProps[resourceStaged.singularResourceIdCamelCased] = resourceId

    const ResourceForm = RESOURCE_FORM_COMPONENTS[resourceName]
    return (
      <Modal
        open={true}
        onClose={() => this.handleCloseModal()}
        closeIcon='close'
      >
        <Header icon={iconName} content={modalHeading}/>
        <Modal.Content>
          <ResourceForm {...otherProps} resourceId={resourceId} resourceName={resourceName} />
        </Modal.Content>
        <Modal.Actions>
          <Button primary
                  onClick={this.handleResourceSubmit}
                  disabled={isEmpty(this.resourceStaged)}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
