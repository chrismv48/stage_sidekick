import React from 'react'
import BaseModel from "./baseModel";
import {computed} from "mobx";
import {Label} from "semantic-ui-react";


class Role extends BaseModel {

  @computed get fullName() {
    return `${this.first_name} ${this.last_name}`
  }

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }

  dropdownItem(options) {
    return (
      {
        image: {src: this.avatar, circular: true},
        // content: this.title,
        text: this.fullName,
        value: this.id,
        key: this.id,
        ...options
      }
    )
  }

  label(options) {
    return (
      <Label as='a' image key={this.id} {...options}>
        <img src={this.avatar}/>
        {this.fullName}
      </Label>
    )
  }


}

Role.FIELD_NAMES = {
  id: null,
  description: null,
  title: null,
  department: null,
  status: null,
  role_type: null,
  start_date: null,
  end_date: null,
  first_name: null,
  last_name: null,
  images: [],
  user: {},
  note_ids: [],
  completed_note_ids: [],
  updated_at: null,
}

Role.RELATIONSHIPS = {}

Role.RESOURCE = 'roles'

export default Role
