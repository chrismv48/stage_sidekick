import {computed, extendObservable, observable, transaction} from 'mobx'
import {BaseModel} from "./baseModel";
import {isEmpty, remove} from 'lodash'

const FIELD_NAMES = {
  id: undefined,
  title: undefined,
  description: undefined,
  display_image: undefined,
  character_ids: [],
  scene_ids: [],
  costume_item_ids: [],
  costumes_characters_scenes: [],
  characters_scenes: []
}

const RESOURCE = 'costumes'

export class Costume extends BaseModel {

  @computed get scenes() {
    return this.store.scenes.filter(scene => this.scene_ids.includes(scene.id))
  }

  @computed get characters() {
    return this.store.characters.filter(character => this.character_ids.includes(character.id))
  }

  @computed get costume_items() {
    return this.store.costume_items.filter(costume_item => this.costume_item_ids.includes(costume_item.id))
  }

  // Returns hash {character: [character_scenes]}
  @computed get characterScenesByCharacter() {
    let groupedCharacterScenes = {}
    for (const costumeCharacterScene of this.costumes_characters_scenes) {
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

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    this.updateCostumeCharacterScenes = this.updateCostumeCharacterScenes.bind(this)

    super._initializeFields()
  }

  updateCostumeCharacterScenes(characterId, characterSceneIds = []) {
    // First delete all CCS's with this characterId because it's easier to overwrite then try to modify
    transaction(() => {
      remove(this.costumes_characters_scenes, (ccs) => ccs.character_id === characterId)

      if (isEmpty(characterSceneIds)) {
        characterSceneIds = [null]
      }

      characterSceneIds.forEach(characterSceneId =>
        this.costumes_characters_scenes.push({
          costume_id: this.id,
          character_id: characterId,
          characters_scene_id: characterSceneId
        })
      )
    })
  }
}
