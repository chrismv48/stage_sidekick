import React from 'react'
import {computed, transaction} from 'mobx'
import BaseModel from "./baseModel";
import SceneFragment from "components/Fragment/SceneFragment";
import {Icon, Image, Label} from "semantic-ui-react";

class Scene extends BaseModel {


  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}

Scene.FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  length_in_minutes: null,
  setting: null,
  order_index: null,
  images: [],
  character_ids: [],
  updated_at: null
}

Scene.RELATIONSHIPS = {
  'characters': 'scenes'
}

Scene.RESOURCE = 'scenes'

Scene.tableColumns = [
  {
    field: 'title',
    header: 'Scene',
    renderCell: (scene) => {
      return (
        <span onClick={() => scene.store.rootStore.uiStore.showResourceSidebar(scene.id, scene.resource)}>
          <SceneFragment scene={scene}/>
        </span>
      )
    },
    filterOptions: {
      multiple: true,
      options: (store) => {
        return store.scenes.map(scene => {
          return {text: scene.title, value: scene.title}
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
    field: 'length_in_minutes',
    header: 'Length In Minutes'
  },
  {
    field: 'setting',
    header: 'Setting'
  },
  {
    field: 'characters',
    header: 'Characters',
    renderCell: (scene) => {
      return (
        <Label.Group>
          {scene.characters.map(character =>
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
  }



]

export default Scene
