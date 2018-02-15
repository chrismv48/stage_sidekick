import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, createTransformer, observable, transaction} from 'mobx'
import {Dropdown, Form, Icon, Segment} from "semantic-ui-react";
import './CostumeForm.scss'
import {isEmpty, pullAll} from "lodash";
import ImageUpload from "components/ImageUpload/ImageUpload";
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class CostumeForm extends React.Component {

  @computed get costume() {
    return this.props.resourceStore.costumes.find(costume => costume.id === this.props.costumeId)
  }

  @computed get costumeStaged() {
    return this.props.resourceStore.getStagedResource('costumes', this.props.costumeId)
  }

  @observable loading = true

  componentDidMount() {
    const {costumeId, resourceStore} = this.props
    this.loading = true

    Promise.all([
      resourceStore.loadCostumes(costumeId),
      resourceStore.loadScenes(),
      resourceStore.loadCharacters(),
      resourceStore.loadCostumeItems(),
    ]).then(() => this.loading = false)
  }

  generateSceneOptions = createTransformer((characterId) => {
    const {characters, scenes} = this.props.resourceStore
    const character = characters.find(character => character.id === characterId)
    const {characters_scenes: characterScenes = []} = character
    return characterScenes.map(characterScene => {
      const scene = scenes.find(scene => scene.id === characterScene.scene_id)
      return {
        key: characterScene.id,
        text: scene.title,
        value: characterScene.id,
      }
    })
  })

  @computed get costumeItemOptions() {
    const {costume_items} = this.props.resourceStore
    return costume_items.map(costumeItem => {
      return {
        key: costumeItem.id,
        text: costumeItem.title,
        value: costumeItem.id,
      }
    })
  }

  // Returns hash {character: [character_scenes]}
  @computed get characterScenesByCharacter() {
    let groupedCharacterScenes = {}
    for (let costumeCharacterScene of this.costumeStaged.costumes_characters_scenes) {
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

  updateCostumeCharacterScenes(characterId, characterSceneIds = []) {
    transaction(() => {
      // First delete all CCS's with this characterId because it's easier to overwrite then try to modify
      this.costumeStaged.costumes_characters_scenes = this.costumeStaged.costumes_characters_scenes.filter(ccs => ccs.character_id !== characterId)
      // remove(this.costumes_characters_scenes, (ccs) => ccs.character_id === characterId)

      if (isEmpty(characterSceneIds)) {
        characterSceneIds = [null]
      }

      characterSceneIds.forEach(characterSceneId =>
        this.costumeStaged.costumes_characters_scenes.push({
          costume_id: this.id,
          character_id: characterId,
          characters_scene_id: characterSceneId
        })
      )
    })
  }

  // Need to take all characters and subtract characters already selected in other character dropdowns
  generateCharacterOptions = createTransformer((characterId) => {
    const {characters} = this.props.resourceStore
    // I guess JavaScript converts all keys into strings?
    const selectedCharacterIds = Object.keys(this.characterScenesByCharacter).map(id => parseInt(id))
    let characterOptions = pullAll(characters.map(character => character.id), selectedCharacterIds)
    if (characterId && characterId > 0) {
      characterOptions.push(characterId)
    }

    return characterOptions.map(characterId => {
      const character = characters.find(character => character.id === characterId)
      return {
        key: character.id,
        text: character.name,
        value: character.id,
      }
    })
  })

  handleCharacterSceneSelection = (event, characterScenes, characterId) => {
    this.updateCostumeCharacterScenes(characterId, characterScenes)
  }

  handleCharacterSelection = (event, characterId, prevCharacterId) => {
    if (characterId === prevCharacterId) return
    this.updateCostumeCharacterScenes(characterId)
  }

  handleDeleteCharacterScene = (characterId) => {
    this.costumeStaged.costumes_characters_scenes = this.costumeStaged.costumes_characters_scenes.filter(ccs => ccs.character_id !== characterId)
  }

  render() {

    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    let costumeStaged = this.costumeStaged
    return (
      <Segment basic>
        <Form>
          <ImageUpload
            images={costumeStaged.images.toJS()}
            handleAddImage={(imageUrl) => costumeStaged.addImage(imageUrl)}
            handleRemoveImage={(imageUrl) => costumeStaged.removeImage(imageUrl)}
            handleChangePrimary={(imageUrl) => costumeStaged.setPrimaryImage(imageUrl)}
            handleOnSort={({oldIndex, newIndex}) => costumeStaged.updateImageOrder(oldIndex, newIndex)}
          />
          <Form.Field>
            <label>Title</label>
            <input
              value={costumeStaged.title || ""}
              onChange={(e) => costumeStaged.title = e.target.value}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={costumeStaged.description || ""}
              onChange={(e) => costumeStaged.description = e.target.value}
            />
          </Form.Field>
          <Form.Field>
            <label>Costume items</label>
            <Dropdown fluid multiple selection
                      options={this.costumeItemOptions || []}
                      value={costumeStaged.costumeItemIds.slice()}
                      onChange={(e, data) => costumeStaged.costumeItemIds = data.value}
            />
          </Form.Field>

          {Object.keys(this.characterScenesByCharacter).map((characterId) => {
              characterId = parseInt(characterId)
              const characterScenesIds = this.characterScenesByCharacter[characterId]
              return (
                <Form.Group inline key={characterId}>
                  <Form.Field>
                    <label>Character</label>
                    <Dropdown placeholder='Character' fluid selection
                              options={this.generateCharacterOptions(characterId)}
                              value={characterId}
                              id={`character-dropdown-${characterId}`}
                              onChange={(event, data) => this.handleCharacterSelection(event, data.value, characterId)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Scenes</label>
                    <Dropdown placeholder='Costume Scenes' fluid multiple selection
                              options={this.generateSceneOptions(characterId)}
                              value={characterScenesIds}
                              id={`scenes-dropdown-${characterId}`}
                              onChange={(event, data) => this.handleCharacterSceneSelection(event, data.value, characterId)}
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
                        options={this.generateCharacterOptions(0)}
                        value=''
                        onChange={(event, data) => this.handleCharacterSelection(event, data.value)}
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
