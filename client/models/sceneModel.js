import {computed, transaction} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  length_in_minutes: null,
  setting: null,
  order_index: null,
  display_image: null,
  character_ids: []
}

const RESOURCE = 'scenes'

export class Scene extends BaseModel {

  @computed
  get characters() {
    return this.store.characters.filter(character => this.character_ids.includes(character.id))
  }

  @computed
  get roles() {
    return this.store.roles.filter(role => this.role_ids.includes(role.id))
  }

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    super._initializeFields()
  }

}
