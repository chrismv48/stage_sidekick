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
    return this.props.resourceStore.costumes.find(costume => costume.id === this.props.costumeItemId)
  }

  @computed get costumeStaged() {
    return this.props.resourceStore.getStagedResource('costumes', this.props.costumeItemId)
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
    const {characters} = this.props.resourceStore
    const character = characters.find(character => character.id === characterId)
    return character.scenes.map(scene => {
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id,
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

  // Returns hash {character: [scenes]}
  @computed get scenesByCharacter() {
    let groupedCharacterScenes = {}
    for (let costumeCharacterScene of this.costumeStaged.costumes_characters_scenes) {
      const {scene_id: sceneId, character_id: characterId} = costumeCharacterScene
      if (characterId in groupedCharacterScenes) {
        groupedCharacterScenes[characterId].push(sceneId)
      }
      else {
        groupedCharacterScenes[characterId] = sceneId ? [sceneId] : []
      }
    }
    return groupedCharacterScenes
  }

  updateCostumeCharacterScenes(characterId, sceneIds = []) {
    transaction(() => {
      // First delete all CCS's with this characterId because it's easier to overwrite then try to modify
      this.costumeStaged.costumes_characters_scenes = this.costumeStaged.costumes_characters_scenes.filter(ccs => ccs.character_id !== characterId)
      // remove(this.costumes_characters_scenes, (ccs) => ccs.character_id === characterId)

      if (isEmpty(sceneIds)) {
        sceneIds = [null]
      }

      sceneIds.forEach(sceneId =>
        this.costumeStaged.costumes_characters_scenes.push({
          costume_id: this.id,
          character_id: characterId,
          scene_id: sceneId
        })
      )
    })
  }

  // Need to take all characters and subtract characters already selected in other character dropdowns
  generateCharacterOptions = createTransformer((characterId) => {
    const {characters} = this.props.resourceStore
    // I guess JavaScript converts all keys into strings?
    const selectedCharacterIds = Object.keys(this.scenesByCharacter).map(id => parseInt(id))
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
                      value={costumeStaged.costume_item_ids.slice()}
                      onChange={(e, data) => costumeStaged.costume_item_ids = data.value}
            />
          </Form.Field>

          {Object.keys(this.scenesByCharacter).map((characterId) => {
              characterId = parseInt(characterId)
              const sceneIds = this.scenesByCharacter[characterId]
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
                              value={sceneIds}
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
