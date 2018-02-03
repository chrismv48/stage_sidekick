import {computed} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  content: null,
  number: null,
  page_number: null,
  line_type: null,
  status: null
}

const RELATIONSHIPS = {
  characters: 'lines',
  scene: 'lines',
}

const RESOURCE = 'lines'

export class Line extends BaseModel {

  constructor(store = null, field_names = FIELD_NAMES, relationships = RELATIONSHIPS, resource = RESOURCE) {
    super(store, field_names, relationships, resource)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}
