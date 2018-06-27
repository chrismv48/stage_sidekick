import React from 'react'
import BaseModel from "./baseModel";

class StageActionSpanModel extends BaseModel {

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
  }

  isStagePresence() {
    return this.spannable_type === 'StagePresence'
  }

  isScene() {
    return this.spannable_type === 'Scene'
  }

  isSong() {
    return this.spannable_type === 'Song'
  }

  startsWithin(span) {
    return (this.span_start >= span.span_start && this.span_start <= span.span_end)
  }
}


StageActionSpanModel.FIELD_NAMES = {
  id: null,
  span_start:  null,
  span_end: null,
  spannable_id: null,
  spannable_type: null,
  spannable: {},
  description: null,
  status: null,
  updated_at: null
}

StageActionSpanModel.RESOURCE = 'stage_action_spans'

StageActionSpanModel.SPAN_TYPES = [
  'Scene',
  'Song',
  'StagePresence'
]

StageActionSpanModel.spanTypeDropdownOptions = [
  {value: 'StagePresence', text: 'Entrance / Exit'},
  {value: 'Scene', text: 'Scene'},
  {value: 'Song', text: 'Song'},
]

StageActionSpanModel.API_ENDPOINT = 'stage_action_spans'


export default StageActionSpanModel
