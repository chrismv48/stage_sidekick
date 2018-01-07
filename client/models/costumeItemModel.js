import {computed} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  item_type: null,
  costume_id: {},
  images: []
}

const RESOURCE = 'costume_items'

export class CostumeItem extends BaseModel {

  @computed get costume() {
    return this.store.costumes.find(costume => this.costume_id === costume.id)
  }

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    super._initializeFields()
  }
}
