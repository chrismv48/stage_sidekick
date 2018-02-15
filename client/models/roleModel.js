import BaseModel from "./baseModel";
import {computed} from "mobx";


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
  user: {}
}

Role.RELATIONSHIPS = {}

Role.RESOURCE = 'roles'

export default Role
