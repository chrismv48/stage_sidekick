import React from 'react';
import {Dropdown, Form} from "semantic-ui-react";
import './ResourceForm.scss'
import ImageUpload from "components/ImageUpload/ImageUpload";
import {capitalize, replace} from 'lodash'
import {inject, observer} from "mobx-react";
import {computed, isObservable, observable} from 'mobx'
import {pluralizeResource} from "helpers";
import PropTypes from 'prop-types'
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject('resourceStore') @observer
export class ResourceForm extends React.Component {

  @observable loading = true

  @computed get resource() {
    const {resourceName, resourceId} = this.props
    return this.props.resourceStore.getStagedResource(resourceName, resourceId)
  }

  componentDidMount() {
    const {resourceName, resourceId} = this.props
    const relationships = Object.keys(this.resource.relationships).map(relationship => pluralizeResource(relationship))

    const loadRelationships = relationships.map(relationship => this.props.resourceStore.loadResource(pluralizeResource(relationship)))
    loadRelationships.push(this.props.resourceStore.loadResource(resourceName, resourceId))

    Promise.all(loadRelationships).then(() => this.loading = false)
  }

  renderTextInput(field, label, formFieldOptions, inputOptions) {
    return (
      <Form.Field key={label} {...formFieldOptions}>
        <label>{label}</label>
        <input
          value={this.resource[field] || ''}
          onChange={e => this.resource[field] = e.target.value}
          {...inputOptions}
        />
      </Form.Field>
    )
  }

  renderTextAreaInput(field, label, formFieldOptions, inputOptions) {
    return (
      <Form.Field key={label} {...formFieldOptions}>
        <label>{label}</label>
        <textarea
          value={this.resource[field] || ''}
          onChange={e => this.resource[field] = e.target.value}
          {...inputOptions}
        />
      </Form.Field>
    )
  }

  renderDropdownInput(field, label, formFieldOptions, inputOptions) {
    debugger
    return (
      <Form.Field key={label} {...formFieldOptions}>
        <label>{label}</label>
        <Dropdown
          fluid
          selection
          placeholder={label}
          onChange={(event, data) => this.resource[field] = data.value}
          {...inputOptions}
        />
      </Form.Field>
    )
  }

  renderImageUploadInput() {
    return (
      <ImageUpload
        images={this.resource.images.toJS()}
        handleAddImage={(imageUrl) => this.resource.addImage(imageUrl)}
        handleRemoveImage={(imageUrl) => this.resource.removeImage(imageUrl)}
        handleChangePrimary={() => this.resource.setPrimaryImage(imageUrl)}
        handleOnSort={({oldIndex, newIndex}) => this.resource.updateImageOrder(oldIndex, newIndex)}
      />
    )
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    return (
      <Form>
        {this.resource.formFields.map(formField => {
          const {field, inputType, label, inputOptions = {}, formFieldOptions = {}} = formField
          const renderLabel = label || capitalize(replace(field, /_/g, ' '))
          switch (inputType) {
            case 'text':
              return this.renderTextInput(field, renderLabel, formFieldOptions, inputOptions)
            case 'textarea':
              return this.renderTextAreaInput(field, renderLabel, formFieldOptions, inputOptions)
            case 'dropdown':
              return this.renderDropdownInput(field, renderLabel, formFieldOptions, inputOptions)
            case 'image_upload':
              return this.renderImageUploadInput()
            default:
              return null
          }
        })}
      </Form>
    );
  }
}

ResourceForm.propTypes = {
  resourceId: PropTypes.number,
  resourceName: PropTypes.string.isRequired,
};


export default ResourceForm
