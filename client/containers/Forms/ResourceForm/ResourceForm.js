import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './ResourceForm.scss'
import _ from "lodash";
import {fetchResource, updateResourceFields} from "api/actions";
import ImageUpload from "components/ImageUpload/ImageUpload";
import {addIdToResource, pluralizeResource} from "../../../helpers";

const relationshipsByResource = {
  'scenes': ['characters'],
  'roles': [],
  'characters': ['scenes', 'roles'],
  'costume_items': ['costumes'],
}

const sceneFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image',
  },
  {
    fieldName: 'title',
    inputType: 'text',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'characters',
    label: 'Characters',
    inputType: 'dropdown',
    dropdownText: 'name',
  },
]

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

const departments = ['Production', 'Lighting', 'Costumes', 'Acting', 'Administration', 'Sound', 'Lighting']

const itemTypes = [
  'Shirt',
  'Pants',
  'Jacket',
  'Shoes',
  'Hat',
  'Belt',
]

const characterFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image',
  },
  {
    fieldName: 'name',
    inputType: 'text',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'scenes',
    inputType: 'dropdown',
    dropdownText: 'title',
  },
  {
    fieldName: 'roles',
    label: 'Played by',
    inputType: 'dropdown',
    dropdownText: (role) => `${role.first_name} ${role.last_name}`,
  },
]

const costumeItemFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image',
  },
  {
    fieldName: 'title',
    inputType: 'text',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'item_type',
    label: 'Type',
    inputType: 'dropdown',
    inputOptions: {
      options: itemTypes.map(item_type => {
        return {text: item_type, value: item_type}
      }),
      multiple: false,
    },
  },
  {
    fieldName: 'costume',
    inputType: 'dropdown',
    dropdownText: 'title',
  },
]

const roleFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image',
  },
  {
    fieldName: 'first_name',
    inputType: 'text',
  },
  {
    fieldName: 'last_name',
    inputType: 'text',
  },
  {
    fieldName: 'title',
    inputType: 'text',
  },
  {
    fieldName: 'department',
    inputType: 'dropdown',
    inputOptions: {
      options: departments.map(department => {
        return {text: department, value: department}
      }),
    },
  },
  {
    fieldName: 'role_type',
    label: 'Employment Type',
    inputType: 'dropdown',
    inputOptions: {
      options: employmentTypes,
    },
  },
]

const formFieldsByResource = {
  'scenes': sceneFormFields,
  'roles': roleFormFields,
  'characters': characterFormFields,
  'costume_items': costumeItemFormFields,
}

@connect((state, ownProps) => {
  const {dispatch, resources} = state
  const {resourceId, resourceName} = ownProps
  let reduxProps = {}
  const relationships = relationshipsByResource[resourceName]

  relationships.forEach(relationship => {
    reduxProps[`${relationship}ById`] = _.get(resources, `${relationship}.byId`, {})
    reduxProps[`${relationship}AllIds`] = _.get(resources, `${relationship}.allIds`, [])
  })

  reduxProps['resource'] = _.get(resources, `${resourceName}.byId.${resourceId}`, {})
  reduxProps['resourceStaging'] = _.get(resources, `${resourceName}.staging.${resourceId}`, {})
  reduxProps['loading'] = _.get(resources, `${resourceName}.loading`)

  return {
    dispatch,
    ...reduxProps
  }
})

export class ResourceForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const {resourceId, resourceName, dispatch} = this.props
    const relationships = relationshipsByResource[resourceName]

    if (resourceId) {
      dispatch(fetchResource(resourceName, `${resourceName}/${resourceId}`))
    }
    relationships.forEach(relationship =>
      dispatch(fetchResource(relationship, relationship)),
    )
  }

  generateRelationshipOptions = (relationshipLabel, textField) => {
    const relationshipById = this.props[`${relationshipLabel}ById`]
    const relationshipAllIds = this.props[`${relationshipLabel}AllIds`] || []
    return relationshipAllIds.map(relationshipId => {
      const relationship = relationshipById[relationshipId]
      return {
        key: relationship.id,
        text: _.isString(textField) ? relationship[textField] : textField(relationship),
        value: relationship.id,
      }
    })
  }

  generateFormfields = () => {
    const {resource, resourceName, resourceStaging, dispatch} = this.props
    const formFields = formFieldsByResource[resourceName]
    return formFields.map(formField => {
      const {
        fieldName,
        inputType,
        label = _.capitalize(fieldName).replace('_', ' '),
        dropdownText,
        inputOptions = {}
      } = formField

      if (inputType === 'text') {
        return (
          <Form.Field key={label}>
            <label>{label}</label>
            <input
              value={_.isUndefined(resourceStaging[fieldName]) ? resource[fieldName] : resourceStaging[fieldName] || ''}
              onChange={e => dispatch(updateResourceFields(resourceName, fieldName, e.target.value, resource.id))}
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
              value={_.isUndefined(resourceStaging[fieldName]) ? resource[fieldName] : resourceStaging[fieldName] || ''}
              onChange={e => dispatch(updateResourceFields(resourceName, fieldName, e.target.value, resource.id))}
            >
            </textarea>
          </Form.Field>
        )
      }
      if (inputType === 'dropdown') {
        const resourceWithId = addIdToResource(fieldName)
        let dropdownOptions = {...inputOptions}
        if (_.isEmpty(dropdownOptions)) {
          const multiple = pluralizeResource(fieldName) === fieldName
          const value = resourceStaging[resourceWithId] || (multiple ? resource[fieldName] : resource[resourceWithId]) || (multiple ? [] : '')
          dropdownOptions = {
            multiple,
            options: this.generateRelationshipOptions(pluralizeResource(fieldName), dropdownText),
            value
          }
        }
        else {
          dropdownOptions.value = resourceStaging[fieldName] || resource[fieldName] || ''
        }
        return (
          <Form.Field key={label}>
            <label>{label}</label>
            <Dropdown
              fluid
              selection
              placeholder={label}
              onChange={(event, data) => dispatch(updateResourceFields(resourceName, resourceWithId, data.value, resource.id))}
              {...dropdownOptions}
            >
            </Dropdown>
          </Form.Field>
        )
      }
      if (inputType === 'image_upload') {
        return (
          <ImageUpload key={label}
                       currentImage={resourceStaging[fieldName] || _.get(resource, `${fieldName}.url`)}
                       handleImageChange={(imageUrl) => dispatch(updateResourceFields(resourceName, fieldName, imageUrl, resource.id))}/>
        )
      }
    })
  }

  render() {
    const {loading} = this.props
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          {this.generateFormfields()}
        </Form>
      </Segment>
    );
  }
}

ResourceForm.propTypes = {};


export default ResourceForm
