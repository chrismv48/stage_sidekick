/*
 *
 * Character
 *
 */

import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './SceneForm.scss'
import * as _ from "lodash";
import {fetchResource, updateResourceFields} from "api/actions";
import ImageUpload from "components/ImageUpload/ImageUpload";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {sceneId} = ownProps
  const {
    characters: {byId: charactersById = {}, allIds: charactersAllIds = []} = {},
    scenes = {}
  } = state.resources

  const scene = _.get(scenes, `byId.${sceneId}`, {})
  const sceneStaging = _.get(scenes, `staging.${sceneId}`, {})
  const loading = scenes.loading

  return {
    dispatch,
    scene,
    sceneStaging,
    loading,
    charactersById,
    charactersAllIds,
  }
})

export class SceneForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const {sceneId} = this.props
    if (sceneId) {
      this.props.dispatch(fetchResource('scenes', `scenes/${sceneId}`))
    }
    this.props.dispatch(fetchResource('characters', 'characters'))
  }

  generateCharacterOptions = () => {
    const {charactersById, charactersAllIds} = this.props
    return charactersAllIds.map(characterId => {
      const character = charactersById[characterId]
      return {
        key: character.id,
        text: character.name,
        value: character.id
      }
    })
  }


  handleCharacterSelection = (event, data) => {
    this.props.dispatch(updateResourceFields('scenes', 'character_ids', data.value, this.props.sceneId))
  }

  render() {
    const {sceneStaging, scene, dispatch, loading, sceneId} = this.props
    const sceneImageUrl = sceneStaging['display_image'] || _.get(scene, 'display_image.url')
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <ImageUpload currentImage={sceneImageUrl}
                       handleImageChange={(imageUrl) => dispatch(updateResourceFields('scenes', 'display_image', imageUrl, sceneId))} />
          <Form.Field>
            <label>Title</label>
            <input
              value={_.isUndefined(sceneStaging['title']) ? scene.title : sceneStaging['title'] || ""}
              onChange={(e) => dispatch(updateResourceFields('scenes', 'title', e.target.value, sceneId))}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={_.isUndefined(sceneStaging['description']) ? scene.description : sceneStaging['description'] || ""}
              onChange={(e) => dispatch(updateResourceFields('scenes', 'description', e.target.value, sceneId))}
            />
          </Form.Field>
          <Form.Field>
            <label>Characters</label>
            <Dropdown placeholder='Characters' fluid multiple selection
                      options={this.generateCharacterOptions()}
                      value={sceneStaging['character_ids'] || scene.characters || []}
                      onChange={(event, data) => this.handleCharacterSelection(event, data)}
            />
          </Form.Field>
        </Form>
      </Segment>
    );
  }
}

SceneForm.propTypes = {};


export default SceneForm
