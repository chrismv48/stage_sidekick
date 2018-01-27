import {computed} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  item_type: null,
  care_instructions: null,
  source: null,
  cost: null,
  notes: null,
  images: []
}

const RELATIONSHIPS = {
  costume: 'costume_items',
}

const RESOURCE = 'costume_items'

export class CostumeItem extends BaseModel {

  constructor(store = null, field_names = FIELD_NAMES, relationships = RELATIONSHIPS, resource = RESOURCE) {
    super(store, field_names, relationships, resource)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}
