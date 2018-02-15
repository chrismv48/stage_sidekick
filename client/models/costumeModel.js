import React from 'react'
import {computed, extendObservable, observable, transaction} from 'mobx'
import BaseModel from "./baseModel";
import CostumeFragment from "../components/Fragment/CostumeFragment";
import {Icon, Image, Label} from "semantic-ui-react";

class Costume extends BaseModel {

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}

Costume.FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  costumes_characters_scenes: [],
  characters_scenes: [],
  images: [],
  character_ids: [],
  scene_ids: [],
  costume_item_ids: [],
  updated_at: null
}

Costume.RELATIONSHIPS = {
  'characters': 'costumes',
  'scenes': 'costumes',
  'costume_items': 'costume'
}

Costume.RESOURCE = 'costumes'

Costume.tableColumns = [
  {
    field: 'title',
    header: 'Title',
    renderCell: (costume) => {
      return (
        <span onClick={() => costume.store.rootStore.uiStore.showResourceSidebar(costume.id, costume.resource)}>
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
            const character = costume.characters.find(character => character.id === character_scene.character_id)
            const scene = costume.scenes.find(scene => scene.id === character_scene.scene_id)
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
