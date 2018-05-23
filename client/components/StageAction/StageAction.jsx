import React from 'react';
import PropTypes from 'prop-types'
import './StageAction.scss'
import {Button, Dropdown, Form, Header, Icon, Image, Segment} from "semantic-ui-react";
import {inject, observer} from "mobx-react/index";
import {computed} from "mobx";


@inject("resourceStore", "uiStore") @observer
class StageAction extends React.Component {

  @computed get stageAction() {
    return this.props.resourceStore.stageActions.find(stageAction => stageAction.id === this.props.stageActionId)
  }

  @computed get stageActionStaged() {
    return this.props.resourceStore.getStagedResource('stage_actions', this.props.stageActionId)
  }

  renderCharacter(character) {
    return (
      <React.Fragment>
      <span className='character-stage-action-avatar'>
        <Image circular inline height={25} width={25} src={character.avatar}/>
      </span>
        <a onClick={() => character.showSidebar} style={{cursor: 'pointer'}}>{character.name}</a>
      </React.Fragment>
    )
  }

  renderCharacters(characters) {
    return (
      <span className='character-stage-action-avatar'>
        {characters.map((character, i) => {
          const last = i === characters.length - 1
          return (
            <a key={i} onClick={() => character.showSidebar} style={{cursor: 'pointer'}}>{character.name}{!last && ', '}</a>
          )
        })}
      </span>
    )
  }


  renderStageActionTypeIcon(stageActionType) {
    let iconName = ''
    let iconTitle = ''
    if (stageActionType === 'line') {
      iconName = 'talk'
      iconTitle = 'Character StageAction'
    } else if (stageActionType === 'song') {
      iconName = 'music'
      iconTitle = 'Song'
    } else if (stageActionType === 'action') {
      iconName = 'microphone slash'
      iconTitle = 'Action'
    }

    return (
      <span className='stage-action-type-icon'>
        <Icon name={iconName} color='grey' size='small' title={iconTitle}/>
      </span>
    )
  }

  renderStageActionHeader() {
    return (
      <Header as='h4'>
        {this.stageActionStaged.characters.length === 1 ?
          this.renderCharacter(this.stageActionStaged.characters[0]) :
          this.renderCharacters(this.stageActionStaged.characters)
        }
        {this.renderStageActionTypeIcon(this.stageActionStaged.stage_action_type)}
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
              <Dropdown.Item icon='edit' text='Edit' onClick={() => handleEdit(this.stageAction.id)} />
              <Dropdown.Item icon='trash' text='Delete' onClick={() => handleDelete()} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className='stage-action-container'>
          <div className='stage-action-number'>
            {this.stageActionStaged.number}
          </div>
          <div className='stage-action-body'>
            {this.renderStageActionHeader(this.stageActionStaged)}
            <div className={'stage_action-content'}>
              {this.stageActionStaged.description}
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

    if (this.stageActionStaged.sceneId) {
      const scene = this.props.resourceStore.scenes.find(scene => scene.id === this.stageActionStaged.sceneId)
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

  generateStageActionTypeOptions() {
    const stageActionTypes = [
      'line',
      'song',
      'action'
    ]
    return stageActionTypes.map((stageActionType, i) => {
      return {
        key: i,
        text: stageActionType,
        value: stageActionType
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
              value={this.stageActionStaged.sceneId}
              onChange={(event, data) => this.stageActionStaged.sceneId = data.value}
            />
            <Form.Select
              label='Character(s)'
              multiple
              options={this.generateSceneCharacterOptions()}
              value={this.stageActionStaged.characterIds.toJS()}
              onChange={(event, data) => {this.stageActionStaged.characterIds = data.value}}
            />
            <Form.Select
              label='StageAction Type'
              options={this.generateStageActionTypeOptions()}
              value={this.stageActionStaged.stage_action_type}
              onChange={(event, data) => this.stageActionStaged.stage_action_type = data.value}
            />
          </Form.Group>
          <Form.TextArea
            label='Line'
            value={this.stageActionStaged.content || ''}
            onChange={(e) => this.stageActionStaged.content = e.target.value}
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
      <div className='StageAction'>
        {editMode ? this.renderEditMode() : this.renderDisplayMode()}
      </div>
    )
  }
}


StageAction.propTypes = {
  stageActionId: PropTypes.number,
  editMode: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  handleInsertAbove: PropTypes.func,
  handleDelete: PropTypes.func
};

export default StageAction
