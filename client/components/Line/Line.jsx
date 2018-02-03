import React from 'react';
import PropTypes from 'prop-types'
import './Line.scss'
import {Button, Dropdown, Form, Header, Icon, Image, Segment} from "semantic-ui-react";
import {inject, observer} from "mobx-react/index";
import {computed} from "mobx";


@inject("resourceStore", "uiStore") @observer
class Line extends React.Component {

  @computed get line() {
    return this.props.resourceStore.lines.find(line => line.id === this.props.lineId)
  }

  @computed get lineStaged() {
    return this.props.resourceStore.getStagedResource('lines', this.props.lineId)
  }

  renderCharacterAvatar(characters) {
    return (
      <span className='character-line-avatar'>
        <Image circular inline height={25} width={25} src={characters[0].avatar}/>
      </span>
    )
  }

  renderLineTypeIcon(lineType) {
    let iconName = ''
    let iconTitle = ''
    if (lineType === 'line') {
      iconName = 'talk'
      iconTitle = 'Character Line'
    } else if (lineType === 'song') {
      iconName = 'music'
      iconTitle = 'Song'
    } else if (lineType === 'action') {
      iconName = 'microphone slash'
      iconTitle = 'Action'
    }

    return (
      <span className='line-type-icon'>
        <Icon name={iconName} color='grey' size='small' title={iconTitle}/>
      </span>
    )
  }

  renderLineHeader() {
    return (
      <Header as='h3'>
        {this.renderCharacterAvatar(this.lineStaged.characters)}
        {this.lineStaged.characters[0].name}
        {this.renderLineTypeIcon(this.lineStaged.line_type)}
      </Header>
    )
  }

  renderDisplayMode() {
    const {handleEdit, handleInsertAbove, handleDelete} = this.props
    return (
      <div className='display-mode' onClick={() => handleEdit(this.line.id)}>
        <div className='edit-icon'>
          <Dropdown icon='ellipsis horizontal' pointing='right'>
            <Dropdown.Menu>
              <Dropdown.Item icon='share' text='Insert above' onClick={() => handleInsertAbove()}/>
              <Dropdown.Item icon='edit' text='Edit' onClick={() => handleEdit(this.line.id)} />
              <Dropdown.Item icon='trash' text='Delete' onClick={() => handleDelete()} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className='line-container'>
          <div className='line-number'>
            {this.lineStaged.number}
          </div>
          <div className='line-body'>
            {this.renderLineHeader(this.lineStaged)}
            <div className={'line-content'}>
              {this.lineStaged.content}
            </div>
          </div>
        </div>
      </div>
    )
  }

  generateSceneOptions() {
    const {scenes} = this.props.resourceStore
    return scenes.map(scene => {
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id
      }
    })
  }

  generateSceneCharacterOptions() {
    let characters

    if (this.lineStaged.scene_id) {
      const scene = this.props.resourceStore.scenes.find(scene => scene.id === this.lineStaged.scene_id)
      characters = this.props.resourceStore.characters.filter(character => scene.character_ids.includes(character.id))
    } else {
      characters = this.props.resourceStore.characters
    }
    return characters.map(character => {
      return {
        key: character.id,
        text: character.name,
        value: character.id
      }
    })
  }

  generateLineTypeOptions() {
    const lineTypes = [
      'line',
      'song',
      'action'
    ]
    return lineTypes.map((lineType, i) => {
      return {
        key: i,
        text: lineType,
        value: lineType
      }
    })
  }

  renderEditMode() {
    const {handleSave, handleCancel} = this.props
    return (
      <Segment>
        <Form>
          <Form.Group>
            <Form.Select
              label='Scene'
              options={this.generateSceneOptions()}
              value={this.lineStaged.scene_id}
              onChange={(event, data) => this.lineStaged.scene_id = data.value}
            />
            <Form.Select
              label='Character(s)'
              multiple
              options={this.generateSceneCharacterOptions()}
              value={this.lineStaged.character_ids.toJS()}
              onChange={(event, data) => {this.lineStaged.character_ids = data.value}}
            />
            <Form.Select
              label='Line Type'
              options={this.generateLineTypeOptions()}
              value={this.lineStaged.line_type}
              onChange={(event, data) => this.lineStaged.line_type = data.value}
            />
          </Form.Group>
          <Form.TextArea
            label='Line'
            value={this.lineStaged.content || ''}
            onChange={(e) => this.lineStaged.content = e.target.value}
          />
          <Button size='mini' compact icon='checkmark' onClick={(e) => {
            e.preventDefault();
            handleSave()
          }}/>
          <Button size='mini' compact icon='remove' onClick={(e) => {
            e.preventDefault();
            handleCancel()
          }}/>
        </Form>
      </Segment>

    )
  }

  render() {
    const {editMode} = this.props

    return (
      <div className='Line'>
        {editMode ? this.renderEditMode() : this.renderDisplayMode()}
      </div>
    )
  }
}


Line.propTypes = {
  lineId: PropTypes.number,
  editMode: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  handleInsertAbove: PropTypes.func,
  handleDelete: PropTypes.func
};

export default Line
