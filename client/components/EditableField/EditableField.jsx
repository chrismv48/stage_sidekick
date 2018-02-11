import React from 'react'
import PropTypes from 'prop-types'
import {computed, observable} from 'mobx'
import {observer} from "mobx-react";
import {inject} from "mobx-react/index";
import {Button, Form, Input, TextArea} from "semantic-ui-react";
import classNames from 'classnames'
import './EditableField.scss'

@inject("resourceStore", "uiStore") @observer
export class EditableField extends React.Component {

  @computed get resource() {
    const {resourceStore, resourceId, resource} = this.props
    return resourceStore.getStagedResource(resource, resourceId)
  }

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
      <p className='display-input textarea-input'>
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
      <Input transparent className='display-input text-input'>
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
      <Form className='edit-input textarea-input'>
        <TextArea
          autoFocus
          onBlur={this.handleOnBlur}
          onFocus={() => {
            this.editing = true
          }}
          onChange={(e) => this.resource[this.props.field] = e.target.value}
          value={this.resource[this.props.field] || ''}
        >
        </TextArea>
        <div style={{float: 'right'}}>
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
        autoFocus
        className='edit-input text-input'
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
        <Button size='mini' compact icon='remove' onMouseDown={this.handleDiscardInput}/>
      </Input>
    )
  }

  saveChange = () => {
    this.resource.save()
    this.editing = false
  }

  handleOnBlur = () => {
    // If the user has made changes, we want to protect against accidental clicks and make them explicitly click the x button
    if (!this.resource.modified) {
      // this.resource.revert()
      this.editing = false
    }
  }

  handleDiscardInput= () => {
    this.resource.revert()
    this.editing = false
  }

  render() {
    return (
      <div
        className={classNames('field-wrapper', this.editing ? 'edit-mode' : 'display-mode')}
        onClick={() => this.editing = true}
      >
        {this.editing ? this.renderEditMode() : this.renderDisplayMode()}
        {/*{this.renderEditMode()}*/}
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
