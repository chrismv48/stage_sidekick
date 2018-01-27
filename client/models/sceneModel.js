import {computed, transaction} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  length_in_minutes: null,
  setting: null,
  order_index: null,
  images: []
}

const RELATIONSHIPS = {
  characters: 'scenes',
}

const RESOURCE = 'scenes'

export class Scene extends BaseModel {

  constructor(store = null, field_names = FIELD_NAMES, relationships = RELATIONSHIPS, resource = RESOURCE) {
    super(store, field_names, relationships, resource)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}
