import React from 'react'
import {computed, transaction} from 'mobx'
import BaseModel from "./baseModel";
import SceneFragment from "components/Fragment/SceneFragment";
import {Icon, Image, Label} from "semantic-ui-react";

class Scene extends BaseModel {

  @computed get tableData() {
    return [
      {
        field: 'title',
        header: 'Scene',
        renderCell:
          <span onClick={() => this.store.rootStore.uiStore.showResourceSidebar(this.id, this.resource)}>
            <SceneFragment scene={this}/>
          </span>,
        filterOptions: {
          multiple: true,
          options: this.store.dropdownOptions('scenes')
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
      }
    ]
  }

  @computed get formFields() {
    return [
      {
        inputType: 'image_upload',
      },
      {
        field: 'title',
        inputType: 'text',
        formFieldOptions: {required: true}
      },
      {
        field: 'description',
        inputType: 'textarea',
      },
      {
        field: 'setting',
        inputType: 'text',
      },
      {
        field: 'length_in_minutes',
        inputType: 'text',
      },
      {
        field: 'character_ids',
        label: 'Characters',
        inputType: 'dropdown',
        inputOptions: {multiple: true, options: this.store.dropdownOptions('characters')}
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
        // content: this.title,
        text: this.title,
        value: this.id,
        key: this.id,
        ...options
      }
    )
  }

  label(options) {
    return (
      <Label as='a' image key={this.id} {...options}>
        <img src={this.avatar}/>
        {this.title}
      </Label>
    )
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
  costume_ids: [],
  note_ids: [],
  updated_at: null
}

Scene.RELATIONSHIPS = {
  'characters': 'scenes'
}

Scene.RESOURCE = 'scenes'

Scene.API_ENDPOINT = 'scenes'

export default Scene
