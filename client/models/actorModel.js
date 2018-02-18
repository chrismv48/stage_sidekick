import React from 'react';
import Role from "models/roleModel";
import ActorFragment from "../components/Fragment/ActorFragment";
import {Icon, Image, Label} from "semantic-ui-react";
import {computed} from "mobx";


class Actor extends Role {

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
  updated_at: null
}

Actor.RELATIONSHIPS = {
  'characters': 'actors',
  'costumes': 'actors',
  'scenes': 'actors',
}

Actor.tableColumns = [
  {
    field: 'fullName',
    header: 'Name',
    renderCell: (actor) => {
      return (
        <span onClick={() => actor.store.rootStore.uiStore.showResourceSidebar(actor.id, actor.resource)}>
          <ActorFragment actor={actor}/>
        </span>
      )
    },
    filterOptions: {
      multiple: true,
      options: (store) => {
        return store.actors.map(actor => {
          return {text: actor.fullName, value: actor.fullName}
        })
      }
    }
  },
  {
    field: 'user.email',
    header: 'Email',
  },
  {
    field: 'scenes',
    header: 'Scenes',
    renderCell: (actor) => {
      return (
        <Label.Group>
          {actor.scenes.map(scene =>
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
    cellProps: {
      textAlign: 'center'
    },
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
    field: 'characters',
    header: 'Characters',
    renderCell: (actor) => {
      return (
        <Label.Group>
          {actor.characters.map(character =>
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
    cellProps: {
      textAlign: 'center'
    }
  },
  {
    field: 'weight',
    header: 'Weight',
    defaultVisible: false,
    cellProps: {
      textAlign: 'center'
    }

  }

]

export default Actor
