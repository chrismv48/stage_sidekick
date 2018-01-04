import React from 'react'
import PropTypes from 'prop-types'
import {computed, observable} from 'mobx'
import {observer} from "mobx-react";
import {capitalize, replace} from "lodash";
import {inject} from "mobx-react/index";
import {Button, Form, Input, TextArea} from "semantic-ui-react";
import './EditableField.scss'

@inject("resourceStore", "uiStore") @observer
export class EditableField extends React.Component {

  @computed get resource() {
    const {resourceStore, resourceId, resource} = this.props
    return resourceStore[resource].find(resource => resource.id === resourceId)
  }

  @observable showEditMode = false
  @observable editing = false


  renderDisplayMode() {
    const {fieldType} = this.props
    switch (fieldType) {
      case "text":
        return this.renderTextDisplayMode()
      case "textarea":
        return this.renderTextareaDisplayMode()
      default:
        return this.renderTextDisplayMode()
    }
  }

  renderEditMode() {
    const {fieldType} = this.props
    switch (fieldType) {
      case "text":
        return this.renderTextEditMode()
      case "textarea":
        return this.renderTextareaEditMode()
      default:
        return this.renderTextEditMode()
    }
  }

  renderTextareaDisplayMode() {
    return (
      <p>
        {
          this.resource[this.props.field] ?
            this.resource[this.props.field] :
            <span className='empty-field'>Click to edit</span>
        }
      </p>
    )
  }

  renderTextDisplayMode() {
    return (
      <Input transparent>
        {
          this.resource[this.props.field] ?
            this.resource[this.props.field] :
            <span className='empty-field'>Click to edit</span>
        }
      </Input>
    )
  }

  renderTextareaEditMode() {
    return (
      <Form>
      <TextArea
        autoHeight
        onBlur={this.handleOnBlur}
        onFocus={() => {
          this.editing = true
        }}
        onChange={(e) => this.resource[this.props.field] = e.target.value}
        value={this.resource[this.props.field] || ''}
      >
      </TextArea>
        <div style={{float:"right"}}>
          <Button size='mini' attached='left' compact icon='checkmark' onMouseDown={this.saveChange}/>
          <Button size='mini' attached='right' compact icon='remove' onMouseDown={this.handleOnBlur}/>
        </div>
      </Form>
    )
  }

  renderTextEditMode() {
    return (
      <Input
        onFocus={() => {
          this.editing = true
        }}
        className='text-input'
        onChange={(e) => this.resource[this.props.field] = e.target.value}
        onBlur={this.handleOnBlur}
        value={this.resource[this.props.field] || ''}
        type='text'
        size='mini'
        fluid
        action
      >
        <input/>
        <Button size='mini' compact icon='checkmark' onMouseDown={this.saveChange}/>
        <Button size='mini' compact icon='remove' onMouseDown={this.handleOnBlur}/>
      </Input>
    )
  }

  saveChange = () => {
    console.log('save change')
    this.resource.save()
    this.showEditMode = false
    this.editing = false
  }

  handleOnBlur = () => {
    this.resource.revert()
    this.showEditMode = false
    this.editing = false
  }

  handleMouseEnter = () => {
    if (!this.editing) {
      console.log('entering!')
      this.showEditMode = true
    }
  }

  handleMouseLeave = () => {
    if (!this.editing) {
      console.log('leaving!')
      this.showEditMode = false
    }
  }

  render() {
    return (
      <div
        className='field-container'
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.showEditMode || this.editing ? this.renderEditMode() : this.renderDisplayMode()}
      </div>
    )
  }
}

EditableField.propTypes = {
  resourceStore: PropTypes.object,
  resource: PropTypes.string.isRequired,
  resourceId: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  fieldType: PropTypes.string
}
