import React from 'react';
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './ResourceForm.scss'
import {capitalize, get, isEmpty, isString, replace} from "lodash";
import ImageUpload from "components/ImageUpload/ImageUpload";
import {inject, observer} from "mobx-react";
import {isObservableArray} from 'mobx'
import {pluralizeResource} from "helpers";
import {formFieldsByResource, relationshipIdToLabel, relationshipsByResource} from "../../../constants";

@inject('resourceStore') @observer
export class ResourceForm extends React.Component {

  componentDidMount() {
    const {resourceId, resourceName} = this.props
    const relationships = relationshipsByResource[resourceName]

    // Change this to resolve eventually?
    this.props.resourceStore.loadResource(resourceName, resourceId)

    relationships.forEach(relationship =>
      this.props.resourceStore.loadResource(relationship)
    )
  }

  generateRelationshipOptions = (relationshipLabel, textField) => {
    const relationshipItems = this.props.resourceStore[relationshipLabel]
    return relationshipItems.map(relationshipItem => {
      return {
        key: relationshipItem.id,
        text: isString(textField) ? relationshipItem[textField] : textField(relationshipItem),
        value: relationshipItem.id,
      }
    })
  }

  generateFormfields = () => {
    const {resourceName, resourceId, resourceStore} = this.props
    const resource = resourceStore.getStagedResource(resourceName, resourceId)
    const formFields = formFieldsByResource[resourceName]

    return formFields.map(formField => {
      const {
        fieldName,
        inputType,
        label = capitalize(replace(fieldName, /_/g, ' ')),
        dropdownText,
        inputOptions = {}
      } = formField

      if (inputType === 'text') {
        return (
          <Form.Field key={label}>
            <label>{label}</label>
            <input
              value={resource[fieldName] || ''}
              onChange={e => resource[fieldName] = e.target.value}
              {...inputOptions}
            >
            </input>
          </Form.Field>
        )
      }
      if (inputType === 'textarea') {
        return (
          <Form.Field key={label}>
            <label>{label}</label>
            <textarea
              value={resource[fieldName] || ''}
              onChange={e => resource[fieldName] = e.target.value}
              {...inputOptions}
            >
            </textarea>
          </Form.Field>
        )
      }
      if (inputType === 'dropdown') {
        let dropdownOptions = {...inputOptions}
        // if no dropdown options are passed, we assume we need to use the relationships to generate them
        if (isEmpty(dropdownOptions)) {
          const multiple = pluralizeResource(fieldName) === fieldName
          const value = isObservableArray(resource[fieldName]) ? resource[fieldName].toJS() : resource[fieldName]
          // const value = resource[fieldName] ? resource[fieldName].toJS() : (multiple ? [] : '')
          const relationshipLabel = relationshipIdToLabel[fieldName] || fieldName
          dropdownOptions = {
            multiple,
            options: this.generateRelationshipOptions(pluralizeResource(relationshipLabel), dropdownText),
            value
          }
        }
        else {
          dropdownOptions.value = resource[fieldName] || ''
        }
        return (
          <Form.Field key={label}>
            <label>{label}</label>
            <Dropdown
              fluid
              selection
              placeholder={label}
              onChange={(event, data) => resource[fieldName] = data.value}
              {...dropdownOptions}
            >
            </Dropdown>
          </Form.Field>
        )
      }
      if (inputType === 'image_upload') {
        return (
          <ImageUpload key={label}
                       currentImage={resource.main_image}
                       handleImageChange={(imageUrl) => resource[fieldName] = imageUrl}
          />
        )
      }
    })
  }

  render() {
    const {isLoading} = this.props.resourceStore
    if (isLoading) {
      return (
        <Segment basic>
          <Dimmer active={isLoading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }

    return (
        <Form>
          {this.generateFormfields()}
        </Form>
    );
  }
}

ResourceForm.propTypes = {};


export default ResourceForm
