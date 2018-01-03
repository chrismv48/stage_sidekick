import {Role} from "./roleModel";
import {FIELD_NAMES as ROLE_FIELD_NAMES} from "models/roleModel";

const RESOURCE = 'actors'

const FIELD_NAMES = {
  ...ROLE_FIELD_NAMES,
  order_index: null,
  gender: null,
  height: null,
  weight: null,
  ethnicity: null,
  eye_color: null,
  hair_color: null,
  chest: null,
  waist: null,
  hips: null,
  neck: null,
  inseam: null,
  sleeve: null,
  shoe_size: null,
  character_ids: []
}

export class Actor extends Role {

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
  }
}
