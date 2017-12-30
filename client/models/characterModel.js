import {computed, extendObservable, observable, transaction} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  name: null,
  description: null,
  type: null,
  order_index: null,
  display_image: null,
  scene_ids: [],
  role_ids: [],
  characters_scenes: []
}

const RESOURCE = 'characters'

export class Character extends BaseModel {

  @computed get scenes() {
    return this.store && this.store.scenes.filter(scene => this.scene_ids.includes(scene.id))
  }
  @computed get roles() {
    return this.store && this.store.roles.filter(role => this.role_ids.includes(role.id))
  }

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    super._initializeFields()
  }
}
