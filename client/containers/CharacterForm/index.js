/*
 *
 * Character
 *
 */

import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './CharacterForm.scss'
import * as _ from "lodash";
import {fetchResource, updateResourceFields} from "../../api/actions";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {characterId} = ownProps
  const {
    scenes: {byId: scenesById = {}, allIds: scenesAllIds = []} = {},
    characters = {}
  } = state.entities

  const character = _.get(characters, `byId.${characterId}`, {})
  const characterStaging = _.get(characters, `staging.${characterId}`, {})
  const loading = characters.loading

  return {
    dispatch,
    character,
    characterStaging,
    loading,
    scenesById,
    scenesAllIds
  }
})

export class CharacterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const {characterId} = this.props
    if (characterId) {
      this.props.dispatch(fetchResource('characters', `characters/${characterId}`))
    }
    this.props.dispatch(fetchResource('scenes', 'scenes'))
  }

  generateSceneOptions = () => {
    const {scenesById, scenesAllIds} = this.props
    return scenesAllIds.map(sceneId => {
      const scene = scenesById[sceneId]
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id
      }
    })
  }

  handleSceneSelection = (event, data) => {
    this.props.dispatch(updateResourceFields('characters', 'scene_ids', data.value, this.props.characterId))
  }

  render() {
    const {characterStaging, character, dispatch, loading, characterId} = this.props
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input
              value={_.isUndefined(characterStaging['name']) ? character.name : characterStaging['name'] || ""}
              onChange={(e) => dispatch(updateResourceFields('characters', 'name', e.target.value, characterId))}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={_.isUndefined(characterStaging['description']) ? character.name : characterStaging['description'] || ""}
              onChange={(e) => dispatch(updateResourceFields('characters', 'description', e.target.value, characterId))}
            />
          </Form.Field>
          <Form.Field>
            <label>Character Scenes</label>
            <Dropdown placeholder='Character Scenes' fluid multiple selection
                      options={this.generateSceneOptions()}
                      value={characterStaging['scene_ids'] || character.scenes || []}
                      onChange={(event, data) => this.handleSceneSelection(event, data)}
            />
          </Form.Field>
        </Form>
      </Segment>
    );
  }
}

CharacterForm.propTypes = {};


export default CharacterForm
