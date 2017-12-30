import {BaseModel} from "./baseModel";
import {computed} from "mobx";

export const FIELD_NAMES = {
  id: undefined,
  user_id: undefined,
  title: undefined,
  department: undefined,
  status: undefined,
  role_type: undefined,
  start_date: undefined,
  end_date: undefined,
  first_name: undefined,
  last_name: undefined,
  display_image: undefined,
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
