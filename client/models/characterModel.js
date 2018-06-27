import React from 'react'
import {computed} from 'mobx'
import BaseModel from "./baseModel";
import CharacterFragment from "components/Fragment/CharacterFragment";
import {Image, Label} from "semantic-ui-react";
import {sortBy} from 'lodash'

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

  @computed get stagePresenceSpans() {
    return sortBy(this.store.stage_action_spans.filter(span => span.spannable.character_id === this.id), span => span.span_start)
  }

  @computed get tableData() {
    return [
      {
        field: 'name',
        header: 'Name',
        renderCell:
          <span
            onClick={() => this.store.rootStore.uiStore.showResourceSidebar(this.id, this.resource)}>
          <CharacterFragment character={this} actor={this.actor} />
        </span>
      },
      {
        field: 'description',
        header: 'Description',
        defaultVisible: false
      },
      {
        field: 'scenes',
        header: 'Scenes',
        renderCell:
          <Label.Group>
            {this.scenes.map(scene =>
              <div style={{whiteSpace: 'nowrap', marginBottom: '5px'}}>
                <Label
                  as='a'
                  image
                  key={scene.id}
                  onClick={() => this.store.rootStore.uiStore.showResourceSidebar(scene.id, scene.resource)}
                >
                  <Image avatar src={scene.avatar}/>
                  {scene.title}
                </Label>
              </div>
            )}
          </Label.Group>,
        sortKey: 'scenes.length',
        filterOptions: {
          multiple: true,
          field: 'scene_ids',
          options: this.store.dropdownOptions('scenes')
        }
      },
      {
        field: 'actors',
        header: 'Actors',
        renderCell:
          <Label.Group>
            {this.actors.map(actor =>
              <div style={{whiteSpace: 'nowrap', marginBottom: '5px'}}>
                <Label
                  as='a'
                  image
                  onClick={() => this.store.rootStore.uiStore.showResourceSidebar(actor.id, actor.resource)}
                  key={actor.id}
                >
                  <Image avatar src={actor.avatar}/>
                  {actor.fullName}
                </Label>
              </div>
            )}
          </Label.Group>,
        sortKey: 'actors.length',
        filterOptions: {
          multiple: true,
          field: 'actor_ids',
          options: this.store.dropdownOptions('actors')
        }
      }
    ]
  }

  @computed get formFields() {
    return [
      {
        inputType: 'image_upload'
      },
      {
        field: 'name',
        inputType: 'text',
        formFieldOptions: {required: true}
      },
      {
        field: 'description',
        inputType: 'textarea',
      },
      {
        field: 'scene_ids',
        label: 'Scenes',
        inputType: 'dropdown',
        inputOptions: {options: this.store.dropdownOptions('scenes'), multiple: true}
      },
      {
        field: 'actor_ids',
        label: 'Played by',
        inputType: 'dropdown',
        inputOptions: {options: this.store.dropdownOptions('actors'), multiple: true}
      }
    ]
  }
}

Character.FIELD_NAMES = {
  id: null,
  name: null,
  description: null,
  type: null,
  order_index: null,
  characters_scenes: [],
  costumes_characters_scenes: [],
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

Character.API_ENDPOINT = 'characters'


export default Character
