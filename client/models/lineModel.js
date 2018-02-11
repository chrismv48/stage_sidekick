import {computed} from 'mobx'
import {BaseModel} from "./baseModel";


class Line extends BaseModel {

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}

Line.FIELD_NAMES = {
  id: null,
  content: null,
  number: null,
  page_number: null,
  line_type: null,
  status: null
}

Line.RELATIONSHIPS = {
  characters: 'lines',
  scene: 'lines',
}

Line.RESOURCE = 'lines'


export default Line
