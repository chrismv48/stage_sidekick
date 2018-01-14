import {computed, extendObservable, observable, transaction} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  name: null,
  description: null,
  type: null,
  order_index: null,
  scene_ids: [],
  actor_ids: [],
  characters_scenes: [],
  images: []
}

const RESOURCE = 'characters'

export class Character extends BaseModel {

  @computed get scenes() {
    return this.store && this.store.scenes.filter(scene => this.scene_ids.includes(scene.id))
  }
  @computed get actors() {
    return this.store && this.store.actors.filter(actor => this.actor_ids.includes(actor.id))
  }

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    super._initializeFields()
  }
}
