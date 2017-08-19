/*
 *
 * Character
 *
 */

import React from 'react';
import {connect} from 'react-redux';
import {fetchCharacter, fetchScenes} from "../../actions";
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import {updateCharacterForm} from "./actions";
import './CharacterForm.scss'
import * as _ from "lodash";

@connect(state => {
  const {
    dispatch,
    character: {character, loading},
    scenes: {scenes},
    characterForm: {formFields}
  } = state
  return {
    dispatch,
    character,
    loading,
    scenes,
    formFields
  }
})

export class CharacterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const {characterId} = this.props
    if (characterId) {
      this.props.dispatch(fetchCharacter(characterId))
    }
    this.props.dispatch(fetchScenes())
  }

  generateSceneOptions = (scenes) => {
    return scenes.map(scene => {
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id
      }
    })
  }

  handleSceneSelection = (event, data) => {
    this.props.dispatch(updateCharacterForm('scene_ids', data.value))
  }

  render() {
    const {loading, character, scenes, formFields, dispatch} = this.props
    const character_scene_ids = _.isEmpty(character) ? [] : character.scenes.map(scene => scene.id)
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input
              value={formFields['name'] || character.name}
              onChange={(e) => dispatch(updateCharacterForm('name', e.target.value))}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={formFields['description'] || character.description}
              onChange={(e) => dispatch(updateCharacterForm('description', e.target.value))}
            />
          </Form.Field>
          <Form.Field>
            <label>Character Scenes</label>
            <Dropdown placeholder='Character Scenes' fluid multiple selection
                      options={this.generateSceneOptions(scenes)}
                      value={formFields['scene_ids'] || character_scene_ids}
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
