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

  renderCharacter(character) {
    return (
      <React.Fragment>
      <span className='character-line-avatar'>
        <Image circular inline height={25} width={25} src={character.avatar}/>
      </span>
        <a onClick={() => character.showSidebar} style={{cursor: 'pointer'}}>{character.name}</a>
      </React.Fragment>
    )
  }

  renderCharacters(characters) {
    return (
      <span className='character-line-avatar'>
        {characters.map((character, i) => {
          const last = i === characters.length - 1
          return (
            <a key={i} onClick={() => character.showSidebar} style={{cursor: 'pointer'}}>{character.name}{!last && ', '}</a>
          )
        })}
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
      <Header as='h4'>
        {this.lineStaged.characters.length === 1 ?
          this.renderCharacter(this.lineStaged.characters[0]) :
          this.renderCharacters(this.lineStaged.characters)
        }
        {this.renderLineTypeIcon(this.lineStaged.line_type)}
      </Header>
    )
  }

  renderDisplayMode() {
    const {handleEdit, handleInsertAbove, handleDelete} = this.props
    return (
      <div className='display-mode'>
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

    if (this.lineStaged.sceneId) {
      const scene = this.props.resourceStore.scenes.find(scene => scene.id === this.lineStaged.sceneId)
      characters = this.props.resourceStore.characters.filter(character => scene.characterIds.includes(character.id))
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
              value={this.lineStaged.sceneId}
              onChange={(event, data) => this.lineStaged.sceneId = data.value}
            />
            <Form.Select
              label='Character(s)'
              multiple
              options={this.generateSceneCharacterOptions()}
              value={this.lineStaged.characterIds.toJS()}
              onChange={(event, data) => {this.lineStaged.characterIds = data.value}}
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
