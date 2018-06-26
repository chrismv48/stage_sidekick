import React from 'react'
import {computed} from "mobx";
import BaseModel from "./baseModel";
import {snakeCase} from 'lodash'

class StageActionModel extends BaseModel {

  @computed get scene() {
    const sceneSpan = this.store.stage_action_spans.find(span => {
      return span.spannable_type === 'Scene' &&
        this.number >= span.span_start &&
        (this.number <= span.span_end || !span.span_end)
    }) || {}

    return this.store.scenes.find(scene => scene.id === sceneSpan.spannable_id)
  }

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}


StageActionModel.FIELD_NAMES = {
  id: null,
  // scene_id: null,
  number:  null,
  page_number: null,
  stage_action_type: null,
  description: null,
  status: null,
  character_ids: [],
  updated_at: null
}

StageActionModel.RELATIONSHIPS = {
  'characters': 'stage_actions',
  // 'scene': 'stage_action'
}

StageActionModel.RESOURCE = 'stage_actions'

StageActionModel.ACTION_TYPE_OPTIONS = [
  'Line',
  'Stage Direction',
]

StageActionModel.actionTypeDropdownOptions = StageActionModel.ACTION_TYPE_OPTIONS.map(n => {
  return {text: n, value: snakeCase(n.toLowerCase())}
})

StageActionModel.API_ENDPOINT = 'stage_actions'


export default StageActionModel
