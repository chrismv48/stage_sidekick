import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, createTransformer, observable} from 'mobx'
import {Dimmer, Dropdown, Form, Icon, Loader, Segment} from "semantic-ui-react";
import './CostumeForm.scss'
import {get, pullAll} from "lodash";
import ImageUpload from "components/ImageUpload/ImageUpload";

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

  // Need to take all characters and subtract characters already selected in other character dropdowns
  generateCharacterOptions = createTransformer((characterId) => {
    const {characters} = this.props.resourceStore
    // I guess JavaScript converts all keys into strings?
    const selectedCharacterIds = Object.keys(this.costumeStaged.characterScenesByCharacter).map(id => parseInt(id))
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
    this.costumeStaged.updateCostumeCharacterScenes(characterId, characterScenes)
  }

  handleCharacterSelection = (event, characterId, prevCharacterId) => {
    if (characterId === prevCharacterId) return
    this.costumeStaged.updateCostumeCharacterScenes(characterId)
  }

  handleDeleteCharacterScene = (characterId) => {
    this.costumeStaged.costumes_characters_scenes = this.costumeStaged.costumes_characters_scenes.filter(ccs => ccs.character_id !== characterId)
  }

  render() {

    if (this.loading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }
    const characterScenesByCharacter = this.costumeStaged.characterScenesByCharacter
    let costumeStaged = this.costumeStaged

    return (
      <Segment basic>
        <Form>
          <ImageUpload
            images={costumeStaged.staged_images.toJS()}
            handleAddImage={(imageUrl) => costumeStaged.addImage(imageUrl)}
            handleRemoveImage={(imageUrl) => costumeStaged.removeImage(imageUrl)}
            handleChangePrimary={(imageId) => costumeStaged.setPrimaryImage(imageId)}
            handleOnSort={({oldIndex, newIndex}) => costumeStaged.updateImageOrder(oldIndex, newIndex)}
          />
          <Form.Field>
            <label>Title</label>
            <input
              value={costumeStaged.staged_title || ""}
              onChange={(e) => costumeStaged.staged_title = e.target.value}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={costumeStaged.staged_description || ""}
              onChange={(e) => costumeStaged.staged_description = e.target.value}
            />
          </Form.Field>
          <Form.Field>
            <label>Costume items</label>
            <Dropdown fluid multiple selection
                      options={this.costumeItemOptions || []}
                      value={costumeStaged.staged_costume_item_ids.toJS() || []}
                      onChange={(e, data) => costumeStaged.staged_costume_item_ids = data.value}
            />
          </Form.Field>

          {Object.keys(characterScenesByCharacter).map((characterId) => {
              characterId = parseInt(characterId)
              const characterScenesIds = characterScenesByCharacter[characterId]
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
