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
import ImageUpload from "../../components/ImageUpload/ImageUpload";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {characterId} = ownProps
  const {
    scenes: {byId: scenesById = {}, allIds: scenesAllIds = []} = {},
    roles: {byId: rolesById = {}, allIds: rolesAllIds = []} = {},
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
    scenesAllIds,
    rolesById,
    rolesAllIds
  }
})

export class CharacterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const {characterId} = this.props
    if (characterId) {
      this.props.dispatch(fetchResource('characters', `characters/${characterId}`))
    }
    this.props.dispatch(fetchResource('scenes', 'scenes'))
    this.props.dispatch(fetchResource('roles', 'roles'))
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

  generateRoleOptions = () => {
    const {rolesById, rolesAllIds} = this.props
    return rolesAllIds.map(roleId => {
      const role = rolesById[roleId]
      return {
        key: role.id,
        text: `${role.first_name} ${role.last_name}`,
        value: role.id
      }
    })
  }


  handleSceneSelection = (event, data) => {
    this.props.dispatch(updateResourceFields('characters', 'scene_ids', data.value, this.props.characterId))
  }

  handleRoleSelection = (event, data) => {
    this.props.dispatch(updateResourceFields('characters', 'role_ids', data.value, this.props.characterId))
  }

  render() {
    const {characterStaging, character, dispatch, loading, characterId} = this.props
    const characterImage = character.display_image.url ? require(`../../../public${character.display_image.url}`) : characterStaging['display_image']
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <ImageUpload currentImage={characterImage}
                       handleImageChange={(imageUrl) => dispatch(updateResourceFields('characters', 'display_image', imageUrl, characterId))} />
          <Form.Field>
            <label>Name</label>
            <input
              value={_.isUndefined(characterStaging['name']) ? character.name : characterStaging['name'] || ""}
              onChange={(e) => dispatch(updateResourceFields('characters', 'name', e.target.value, characterId))}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={_.isUndefined(characterStaging['description']) ? character.description : characterStaging['description'] || ""}
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
          <Form.Field>
            <label>Played By</label>
            <Dropdown placeholder='Actor(s)' fluid multiple selection
                      options={this.generateRoleOptions()}
                      value={characterStaging['role_ids'] || character.roles || []}
                      onChange={(event, data) => this.handleRoleSelection(event, data)}
            />
          </Form.Field>
        </Form>
      </Segment>
    );
  }
}

CharacterForm.propTypes = {};


export default CharacterForm
