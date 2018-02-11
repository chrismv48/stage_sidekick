import React from 'react'
import {computed, extendObservable, observable, transaction} from 'mobx'
import {BaseModel} from "./baseModel";
import {isEmpty} from 'lodash'
import CostumeFragment from "../components/Fragment/CostumeFragment";
import {Icon, Image, Label} from "semantic-ui-react";

class Costume extends BaseModel {

  // Returns hash {character: [character_scenes]}
  @computed get characterScenesByCharacter() {
    let groupedCharacterScenes = {}
    for (let costumeCharacterScene of this.costumes_characters_scenes) {
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

  constructor(store = null) {
    super(store)
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

Costume.FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  costumes_characters_scenes: [],
  characters_scenes: [],
  images: []
}

Costume.RELATIONSHIPS = {
  characters: 'costumes',
  scenes: 'scenes',
  costume_items: 'costumes'
}

Costume.RESOURCE = 'costumes'

Costume.tableColumns = [
  {
    field: 'title',
    header: 'Title',
    renderCell: (costume) => {
      return (
        <span onClick={() => costume.store.rootStore.uiStore.showResourceSidebar(costume.id, costume.RESOURCE)}>
          <CostumeFragment costume={costume}/>
        </span>
      )
    },
    filterOptions: {
      multiple: true,
      options: (store) => {
        return store.costumes.map(costume => {
          return {text: costume.title, value: costume.title}
        })
      }
    }
  },
  {
    field: 'description',
    header: 'Description',
    defaultVisible: false
  },
  {
    field: 'character_scenes',
    header: 'Character Scenes',
    renderCell: (costume) => {
      return (
        <Label.Group>
          {costume.characters_scenes.map(character_scene => {
            const character = costume.store.characters.find(character => character.id === character_scene.character_id)
            const scene = costume.store.scenes.find(scene => scene.id === character_scene.scene_id)
            return (
              <Label as='a' image key={character_scene.id}>
                <Image avatar src={character.avatar}/>
                {character.name}
                <Label.Detail>
                  {scene.title}
                  <Icon name='delete'/>
                </Label.Detail>
              </Label>
            )
          })}
        </Label.Group>
      )
    },
    sortKey: 'characters_scenes.length'
  },
  {
    field: 'characters',
    header: 'Characters',
    renderCell: (costume) => {
      return (
        <Label.Group>
          {costume.characters.map(character =>
            <Label as='a' image key={character.id}>
              <Image avatar src={character.avatar}/>
              {character.name}
              <Icon name='delete'/>
            </Label>
          )}
        </Label.Group>
      )
    },
    filterOptions: {
      multiple: true,
      field: 'character_ids',
      options: (store) => {
        return store.characters.map(character => {
          return {text: character.name, value: character.id}
        })
      }
    },
    sortKey: 'characters.length',
    defaultVisible: false
  },
  {
    field: 'scenes',
    header: 'Scenes',
    renderCell: (costume) => {
      return (
        <Label.Group>
          {costume.scenes.map(scene =>
            <Label as='a' image key={scene.id}>
              <Image avatar src={scene.avatar}/>
              {scene.title}
              <Icon name='delete'/>
            </Label>
          )}
        </Label.Group>
      )
    },
    filterOptions: {
      multiple: true,
      field: 'scene_ids',
      options: (store) => {
        return store.scenes.map(scene => {
          return {text: scene.title, value: scene.id}
        })
      }
    },
    sortKey: 'scenes.length',
    defaultVisible: false
  }
]

export default Costume
