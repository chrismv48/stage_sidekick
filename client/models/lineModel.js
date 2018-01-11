import {computed} from 'mobx'
import {BaseModel} from "./baseModel";

const FIELD_NAMES = {
  id: null,
  content: null,
  number: null,
  page_number: null,
  line_type: null,
  status: null,
  character_ids: [],
  scene_id: {},
}

const RESOURCE = 'lines'

export class Line extends BaseModel {

  @computed get characters() {
    return this.store && this.store.characters.filter(character => this.character_ids.includes(character.id))
  }
  @computed get scene() {
    return this.store && this.store.scenes.find(scene => this.scene_id === scene.id)
  }

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    super._initializeFields()
  }
}
