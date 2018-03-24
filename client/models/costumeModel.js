import React from 'react'
import {computed, extendObservable, observable, transaction} from 'mobx'
import BaseModel from "./baseModel";
import CostumeFragment from "../components/Fragment/CostumeFragment";
import {Icon, Image, Label} from "semantic-ui-react";

class Costume extends BaseModel {

  @computed get tableData() {
    return [
      {
        field: 'title',
        header: 'Title',
        renderCell:
          <span onClick={() => this.store.rootStore.uiStore.showResourceSidebar(this.id, this.resource)}>
          <CostumeFragment costume={this}/>
        </span>,
        filterOptions: {
          multiple: true,
          options: this.store.dropdownOptions('costumes')
        }
      },
      {
        field: 'description',
        header: 'Description',
        defaultVisible: false
      },
      {
        field: 'costumes_characters_scenes',
        header: 'Character Scenes',
        renderCell:
          <Label.Group>
            {this.costumes_characters_scenes.map(costumes_characters_scene => {
              const character = this.characters.find(character => character.id === costumes_characters_scene.character_id)
              const scene = this.scenes.find(scene => scene.id === costumes_characters_scene.scene_id)
              return (
                <Label as='a' image key={costumes_characters_scene.id}>
                  <Image avatar src={character.avatar}/>
                  {character.name}
                  <Label.Detail>
                    {scene && scene.title}
                    <Icon name='delete'/>
                  </Label.Detail>
                </Label>
              )
            })}
          </Label.Group>,
        sortKey: 'costumes_characters_scenes.length'
      },
      {
        field: 'characters',
        header: 'Characters',
        renderCell:
          <Label.Group>
            {this.characters.map(character =>
              <Label as='a' image key={character.id}>
                <Image avatar src={character.avatar}/>
                {character.name}
                <Icon name='delete'/>
              </Label>
            )}
          </Label.Group>,
        filterOptions: {
          multiple: true,
          field: 'character_ids',
          options: this.store.dropdownOptions('characters')
        },
        sortKey: 'characters.length',
        defaultVisible: false
      },
      {
        field: 'scenes',
        header: 'Scenes',
        renderCell:
          <Label.Group>
            {this.scenes.map(scene =>
              <Label as='a' image key={scene.id}>
                <Image avatar src={scene.avatar}/>
                {scene.title}
                <Icon name='delete'/>
              </Label>
            )}
          </Label.Group>,
        filterOptions: {
          multiple: true,
          field: 'scene_ids',
          options: this.store.dropdownOptions('scenes')
        },
        sortKey: 'scenes.length',
        defaultVisible: false
      }
    ]
  }

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
        text: this.title,
        value: this.id,
        key: this.id,
        ...options
      }
    )
  }
}

Costume.FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  costumes_characters_scenes: [],
  images: [],
  comments: [],
  character_ids: [],
  scene_ids: [],
  costume_item_ids: [],
  updated_at: null,
  note_ids: []
}

Costume.RELATIONSHIPS = {
  'characters': 'costumes',
  'scenes': 'costumes',
  'costume_items': 'costume'
}

Costume.RESOURCE = 'costumes'
Costume.API_ENDPOINT = 'costumes'

export default Costume
