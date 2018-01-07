import {BaseModel} from "./baseModel";
import {computed} from "mobx";

export const FIELD_NAMES = {
  id: null,
  description: null,
  user_id: null,
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

const RESOURCE = 'roles'

export class Role extends BaseModel {

  @computed get fullName() {
    return `${this.first_name} ${this.last_name}`
  }

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
    this.store = store

    super._initializeFields()
  }
}
