import {computed, extendObservable, observable, transaction} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  name: null,
  description: null,
  type: null,
  order_index: null,
  characters_scenes: [],
  images: []
}

const RELATIONSHIPS = {
  scenes: 'characters',
  actors: 'characters'
}

const RESOURCE = 'characters'

export class Character extends BaseModel {

  constructor(store = null, field_names = FIELD_NAMES, relationships = RELATIONSHIPS, resource = RESOURCE) {
    super(store, field_names, relationships, resource)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}
