import React from 'react';
import Role from "models/roleModel";
import ActorFragment from "../components/Fragment/ActorFragment";
import {Image, Label} from "semantic-ui-react";
import {computed} from "mobx";


class Actor extends Role {

  @computed get formFields() {
    return [
      {
        field: 'display_image',
        inputType: 'image_upload',
      },
      {
        field: 'fullName',
        inputType: 'text',
        inputOptions: {readOnly: true}
      },
      {
        field: 'character_ids',
        label: 'Characters',
        inputType: 'dropdown',
        inputOptions: {options: this.store.dropdownOptions('characters'), multiple: true}
      },
      {
        field: 'description',
        inputType: 'textarea',
      },
      {
        field: 'gender',
        inputType: 'text',
      },
      {
        field: 'height',
        inputType: 'text',
      },
      {
        field: 'weight',
        inputType: 'text',
      },
      {
        field: 'ethnicity',
        inputType: 'text',
      },
      {
        field: 'eye_color',
        inputType: 'text',
      },
      {
        field: 'hair_color',
        inputType: 'text',
      },
      {
        field: 'chest',
        inputType: 'text',
      },
      {
        field: 'waist',
        inputType: 'text',
      },
      {
        field: 'hips',
        inputType: 'text',
      },
      {
        field: 'neck',
        inputType: 'text',
      },
      {
        field: 'inseam',
        inputType: 'text',
      },
      {
        field: 'sleeve',
        inputType: 'text',
      },
      {
        field: 'shoe_size',
        inputType: 'text',
      },
    ]
  }

  @computed get tableData() {
    return [
      {
        field: 'fullName',
        header: 'Name',
        renderCell:
          <span onClick={() => this.store.rootStore.uiStore.showResourceSidebar(this.id, this.resource)}>
            <ActorFragment actor={this}/>
          </span>,
        filterOptions: {
          multiple: true,
          options: this.store.dropdownOptions('actors')
        }
      },
      {
        field: 'description',
        header: 'Description',
        defaultVisible: false
      },
      {
        field: 'characters',
        header: 'Characters',
        renderCell:
          <Label.Group>
            {this.characters.map(character =>
              <div style={{whiteSpace: 'nowrap', marginBottom: '5px'}}>
                <Label
                  as='a'
                  image
                  key={character.id}
                  onClick={() => {this.store.rootStore.uiStore.showResourceSidebar(character.id, character.resource)}}
                >
                  <Image avatar src={character.avatar}/>
                  {character.name}
                </Label>
              </div>
            )}
          </Label.Group>,
        filterOptions: {
          multiple: true,
          field: 'character_ids',
          options: this.store.dropdownOptions('characters')
        },
        sortKey: 'characters.length',
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
        field: 'gender',
        header: 'Gender',
        defaultVisible: false,
      },
      {
        field: 'height',
        header: 'Height',
        defaultVisible: false,
      },
      {
        field: 'weight',
        header: 'Weight',
        defaultVisible: false,
      }
    ]
  }

  constructor(store = null) {
    super(store)

    // boilerplate constructor calls are handled by parent Role class
  }

  dropdownItem(options) {
    return (
      {
        image: {src: this.avatar, circular: true},
        text: this.fullName,
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
        {this.fullName}
      </Label>
    )
  }
}

Actor.RESOURCE = 'actors'

Actor.FIELD_NAMES = {
  ...Role.FIELD_NAMES,
  order_index: null,
  gender: null,
  height: null,
  weight: null,
  ethnicity: null,
  eye_color: null,
  hair_color: null,
  chest: null,
  waist: null,
  hips: null,
  neck: null,
  inseam: null,
  sleeve: null,
  shoe_size: null,
  costumes_characters_scenes: [],
  character_ids: [],
  costume_ids: [],
  scene_ids: [],
  note_ids: [],
  updated_at: null
}

Actor.profileFields = [
  'gender',
  'height',
  'weight',
  'ethnicity',
  'eye_color',
  'hair_color',
]

Actor.measurementFields = [
  'chest',
  'waist',
  'hips',
  'neck',
  'inseam',
  'sleeve',
  'shoe_size'
]

Actor.RELATIONSHIPS = {
  'characters': 'actors',
  'costumes': 'actors',
  'scenes': 'actors',
}

Actor.API_ENDPOINT = 'actors'

export default Actor
