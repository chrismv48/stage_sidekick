import React from 'react'
import {computed} from 'mobx'
import BaseModel from "./baseModel";


class StageActionModel extends BaseModel {

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }
}

StageActionModel.FIELD_NAMES = {
  id: null,
  scene_id: null,
  number:  null,
  page_number: null,
  stage_action_type: null,
  description: null,
  status: null,
  song: null,
  is_entrance: null,
  is_exit: null,
  entrance_exit_location: null,
  updated_at: null,
  character_ids: []
}

StageActionModel.RELATIONSHIPS = {
  'characters': 'stage_actions',
}

StageActionModel.RESOURCE = 'stage_actions'

StageActionModel.ACTION_TYPE_OPTIONS = [
  'Line',
  'Stage Direction',
  'Song',
  'Entrance',
  'Exit'
]

StageActionModel.actionTypeDropdownOptions = StageActionModel.ACTION_TYPE_OPTIONS.map(n => {
  return {text: n, value: n}
})

StageActionModel.API_ENDPOINT = 'stage_actions'


export default StageActionModel
