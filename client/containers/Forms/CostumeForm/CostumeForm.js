import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Dropdown, Form, Icon, Loader, Segment} from "semantic-ui-react";
import './CostumeForm.scss'
import * as _ from "lodash";
import {fetchResource, updateResourceFields} from "api/actions";
import ImageUpload from "components/ImageUpload/ImageUpload";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {costumeId} = ownProps
  const {
    scenes: {byId: scenesById = {}, allIds: scenesAllIds = []} = {},
    characters: {byId: charactersById = {}, allIds: charactersAllIds = []} = {},
    costumes_characters_scenes: {byId: costumesCharactersScenesById = {}, allIds: costumesCharactersScenesAllIds = []} = {},
    characters_scenes: {byId: charactersScenesById = {}, allIds: charactersScenesAllIds = []} = {},
    costumes = {},
  } = state.resources

  const costume = _.get(costumes, `byId.${costumeId}`, {})
  const costumeStaging = _.get(costumes, `staging.${costumeId}`, {})
  const loading = costumes.loading

  return {
    dispatch,
    costume,
    costumeStaging,
    loading,
    scenesById,
    scenesAllIds,
    charactersById,
    charactersAllIds,
    costumesCharactersScenesAllIds,
    costumesCharactersScenesById,
    charactersScenesAllIds,
    charactersScenesById,
  }
})

export class CostumeForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  state = {groupedCharacterScenes: {}}

  componentDidMount() {
    const {costumeId, dispatch} = this.props
    if (costumeId) {
      dispatch(fetchResource('costumes', `costumes/${costumeId}`))
      this.setState({groupedCharacterScenes: this.groupCharacterScenes()})
    }
    dispatch(fetchResource('scenes', 'scenes'))
    dispatch(fetchResource('characters', 'characters'))
  }

  groupCharacterScenes() {
    const {costume, costumesCharactersScenesById} = this.props
    let groupedCharacterScenes = {}
    for (const ccsId of costume.costumes_characters_scenes) {
      const costumeCharacterScene = costumesCharactersScenesById[ccsId]
      const {characters_scene_id: characterSceneId, character_id: characterId} = costumeCharacterScene
      if (characterId in groupedCharacterScenes) {
        groupedCharacterScenes[characterId].push(characterSceneId)
      }
      else {
        groupedCharacterScenes[characterId] = characterSceneId ? [characterSceneId] : []
      }
    }
    return groupedCharacterScenes
  }

  generateSceneOptions = (characterId) => {
    const {charactersScenesById, charactersById, scenesById} = this.props
    const character = charactersById[characterId]
    const {characters_scenes: characterScenes = []} = character
    return characterScenes.map(characterSceneId => {
      const scene = scenesById[charactersScenesById[characterSceneId].scene_id]
      return {
        key: characterSceneId,
        text: scene.title,
        value: characterSceneId,
      }
    })
  }

  getGroupedCharacterScenes = () => {
    let {grouped_costumes_characters_scenes = {}} = this.props.costumeStaging
    if (_.isEmpty(grouped_costumes_characters_scenes)) {
      grouped_costumes_characters_scenes = {...this.state.groupedCharacterScenes}
    }
    return grouped_costumes_characters_scenes
  }

  generateCharacterOptions = (characterId) => {
    const grouped_costumes_characters_scenes = this.getGroupedCharacterScenes()
    const {charactersById, charactersAllIds} = this.props
    // I guess JavaScript converts all keys into strings?
    const groupedCostumesCharactersScenesIds = Object.keys(grouped_costumes_characters_scenes).map(id => parseInt(id))
    let characterOptions = _.pullAll(charactersAllIds, groupedCostumesCharactersScenesIds)
    if (characterId) { characterOptions.push(characterId) }
    return characterOptions.map(characterId => {
      const character = charactersById[characterId]
      return {
        key: character.id,
        text: character.name,
        value: character.id,
      }
    })
  }

  handleSceneSelection = (event, data, characterId) => {
    const grouped_costumes_characters_scenes = this.getGroupedCharacterScenes()

    grouped_costumes_characters_scenes[characterId] = data.value
    this.props.dispatch(updateResourceFields('costumes', 'grouped_costumes_characters_scenes', grouped_costumes_characters_scenes, this.props.costumeId))
  }

  handleCharacterSelection = (event, data, previousValue) => {
    const grouped_costumes_characters_scenes = this.getGroupedCharacterScenes()

    delete grouped_costumes_characters_scenes[previousValue]
    grouped_costumes_characters_scenes[data.value] = []
    this.props.dispatch(updateResourceFields('costumes', 'grouped_costumes_characters_scenes', grouped_costumes_characters_scenes, this.props.costumeId))
  }

  handleDeleteCharacterScene = (characterId) => {
    const grouped_costumes_characters_scenes = this.getGroupedCharacterScenes()

    delete grouped_costumes_characters_scenes[characterId]
    this.props.dispatch(updateResourceFields('costumes', 'grouped_costumes_characters_scenes', grouped_costumes_characters_scenes, this.props.costumeId))
  }

  render() {
    const {costumeStaging = {}, charactersScenesById = {}, costume, dispatch, loading, costumeId, charactersById, scenesById} = this.props
    const costumeImageUrl = costumeStaging['display_image'] || _.get(costume, 'display_image.url')
    const {characters_costumes_attributes: characterScenes = []} = costumeStaging
    const groupedCharacterScenes = this.getGroupedCharacterScenes()

    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <ImageUpload currentImage={costumeImageUrl}
                       handleImageChange={(imageUrl) => dispatch(updateResourceFields('costumes', 'display_image', imageUrl, costumeId))}/>
          <Form.Field>
            <label>Title</label>
            <input
              value={_.isUndefined(costumeStaging['title']) ? costume.title : costumeStaging['title'] || ""}
              onChange={(e) => dispatch(updateResourceFields('costumes', 'title', e.target.value, costumeId))}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={_.isUndefined(costumeStaging['description']) ? costume.description : costumeStaging['description'] || ""}
              onChange={(e) => dispatch(updateResourceFields('costumes', 'description', e.target.value, costumeId))}
            />
          </Form.Field>

          {Object.keys(groupedCharacterScenes).map((characterId) => {
              characterId = parseInt(characterId)
              const characterScenesIds = groupedCharacterScenes[characterId]
              return (
                <Form.Group inline key={characterId}>
                  <Form.Field>
                    <label>Character</label>
                    <Dropdown placeholder='Character' fluid selection
                              options={this.generateCharacterOptions(characterId)}
                              value={characterId}
                              id={`character-dropdown-${characterId}`}
                              onBlur={(event, data) => this.previousValue = event.target.value}
                              onChange={(event, data) => this.handleCharacterSelection(event, data, characterId)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Scenes</label>
                    <Dropdown placeholder='Costume Scenes' fluid multiple selection
                              options={this.generateSceneOptions(characterId)}
                              value={characterScenesIds}
                              id={`scenes-dropdown-${characterId}`}
                              onChange={(event, data) => this.handleSceneSelection(event, data, characterId)}
                    />
                  </Form.Field>
                  <Icon
                    name="remove circle"
                    color="red"
                    size="large"
                    style={{marginTop: 13, cursor: 'pointer'}}
                    onClick={() => this.handleDeleteCharacterScene(characterId)}
                  />
                </Form.Group>
              )
            },
          )}
          <Form.Group inline>
            <Form.Field>
              <label>Character</label>
              <Dropdown placeholder='Character' fluid selection
                        options={this.generateCharacterOptions()}
                        value=''
                        onChange={(event, data) => this.handleCharacterSelection(event, data)}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}

CostumeForm.propTypes = {};


export default CostumeForm
