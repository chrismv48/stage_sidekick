import React from 'react';
import PropTypes from 'prop-types'
import './StageAction.scss'
import {Button, Dropdown, Form, Header, Icon, Image, Segment} from "semantic-ui-react";
import {inject, observer} from "mobx-react/index";
import {computed} from "mobx";


@inject("resourceStore", "uiStore") @observer
class StageAction extends React.Component {

  @computed get stageAction() {
    return this.props.resourceStore.stage_actions.find(stageAction => stageAction.id === this.props.stageActionId)
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
            <a key={`${character.name}-${i}`} onClick={() => character.showSidebar} style={{cursor: 'pointer'}}>{character.name}{!last && ', '}</a>
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
      iconTitle = 'Line'
    } else if (stageActionType === 'song') {
      iconName = 'music'
      iconTitle = 'Song'
    } else if (stageActionType === 'stage_direction') {
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
        {this.stageAction.characters.length === 1 ?
          this.renderCharacter(this.stageAction.characters[0]) :
          this.renderCharacters(this.stageAction.characters)
        }
        {this.renderStageActionTypeIcon(this.stageAction.stage_action_type)}
      </Header>
    )
  }

  renderDisplayMode() {
    const {handleEdit, handleInsertAbove, handleDelete} = this.props
    return (
      <div className={`display-mode ${this.stageAction.stage_action_type}`}>
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
            {this.stageAction.number}
          </div>
          <div className='stage-action-body'>
            {this.renderStageActionHeader(this.stageAction)}
            <div className={'stage_action-content'}>
              {this.stageAction.description}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  renderEditMode() {
    const {handleSave, handleCancel, resourceStore: {dropdownOptions}} = this.props
    debugger
    return (
      <Segment>
        <Form>
          <Form.Group>
            <Form.Select
              label='Scene'
              options={dropdownOptions('scenes')}
              value={this.stageAction.sceneId}
              onChange={(event, data) => this.stageAction.sceneId = data.value}
            />
            <Form.Select
              label='Character(s)'
              multiple
              options={dropdownOptions('characters')}
              value={this.stageAction.characterIds.toJS()}
              onChange={(event, data) => {
                this.stageAction.characterIds = data.value
              }}
            />
            <Form.Select
              label='Stage Action Type'
              options={this.stageAction.constructor.actionTypeDropdownOptions}
              value={this.stageAction.stage_action_type}
              onChange={(event, data) => this.stageAction.stage_action_type = data.value}
            />
          </Form.Group>
          <Form.TextArea
            label='Line'
            value={this.stageAction.description || ''}
            onChange={(e) => this.stageAction.description = e.target.value}
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
