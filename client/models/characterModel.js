import React from 'react'
import {computed, extendObservable, observable, transaction} from 'mobx'
import BaseModel from "./baseModel";
import CharacterFragment from "components/Fragment/CharacterFragment";
import {Icon, Image, Label} from "semantic-ui-react";

class Character extends BaseModel {

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }

  dropdownItem(options) {
    return (
      {
        image: {src: this.avatar, circular: true},
        text: this.name,
        value: this.id,
        key: this.id,
        ...options
      }
    )
  }
}

Character.FIELD_NAMES = {
  id: null,
  name: null,
  description: null,
  type: null,
  order_index: null,
  characters_scenes: [],
  images: [],
  scene_ids: [],
  actor_ids: [],
  costume_ids: [],
  updated_at: null
}

Character.RESOURCE = 'characters'

// relationship: backRef provides information about the relationship type
Character.RELATIONSHIPS = {
  'scenes': 'characters',
  'actors': 'characters',
  'costumes': 'characters'
}

Character.tableColumns = [
  {
    field: 'name',
    header: 'Name',
    renderCell: (character) => {
      return (
        <span onClick={() => character.store.rootStore.uiStore.showResourceSidebar(character.id, character.resource)}>
          <CharacterFragment character={character}/>
        </span>
      )
    }
  },
  {
    field: 'description',
    header: 'Description',
    defaultVisible: false
  },
  {
    field: 'scenes',
    header: 'Scenes',
    renderCell: (character) => {
      return (
        <Label.Group>
          {character.scenes.map(scene =>
            <Label as='a' image key={scene.id}>
              <Image avatar src={scene.avatar}/>
              {scene.title}
              <Icon name='delete'/>
            </Label>
          )}
        </Label.Group>
      )
    },
    sortKey: 'scenes.length',
    filterOptions: {
      multiple: true,
      field: 'scene_ids',
      options: (store) => {
        return store.scenes.map(scene => {
          return {text: scene.title, value: scene.id}
        })
      }
    }
  },
  {
    field: 'actors',
    header: 'Actors',
    renderCell: (character) => {
      return (
        <Label.Group>
          {character.actors.map(actor =>
            <Label as='a' image key={actor.id}>
              <Image avatar src={actor.avatar}/>
              {actor.fullName}
              <Icon name='delete'/>
            </Label>
          )}
        </Label.Group>
      )
    },
    sortKey: 'actors.length',
    filterOptions: {
      multiple: true,
      field: 'actor_ids',
      options: (store) => {
        return store.actors.map(actor => {
          return {text: actor.fullName, value: actor.id}
        })
      }
    }
  },
  {
    field: 'costumes',
    header: 'Costumes',
    renderCell: (character) => {
      return (
        <div>
          {character.costumes.map(costume =>
            <Label image key={costume.id}>
              <Image avatar src={costume.avatar}/>
              {costume.title}
              <Icon name='delete'/>
            </Label>
          )}
        </div>
      )
    },
    sortKey: 'costumes.length',
    filterOptions: {
      multiple: true,
      field: 'costume_ids',
      options: (store) => {
        return store.costumes.map(costume => {
          return {text: costume.title, value: costume.id}
        })
      }
    }
  }
]

export default Character
