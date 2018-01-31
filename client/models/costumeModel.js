import {computed, extendObservable, observable, transaction} from 'mobx'
import {BaseModel} from "./baseModel";
import {isEmpty} from 'lodash'

const FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  costumes_characters_scenes: [],
  characters_scenes: [],
  images: []
}

const RELATIONSHIPS = {
  characters: 'costumes',
  scenes: 'scenes',
  costume_items: 'costumes'
}

const RESOURCE = 'costumes'

export class Costume extends BaseModel {

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

  constructor(store = null, field_names = FIELD_NAMES, relationships = RELATIONSHIPS, resource = RESOURCE) {
    super(store, field_names, relationships, resource)
    this.store = store

    this.updateCostumeCharacterScenes = this.updateCostumeCharacterScenes.bind(this)

    super._initializeFields()
    super._initializeRelationships()
  }

  updateCostumeCharacterScenes(characterId, characterSceneIds = []) {
    transaction(() => {

      // First delete all CCS's with this characterId because it's easier to overwrite then try to modify
      this.costumes_characters_scenes = this.costumes_characters_scenes.filter(ccs => ccs.character_id !== characterId)
      // remove(this.costumes_characters_scenes, (ccs) => ccs.character_id === characterId)

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
