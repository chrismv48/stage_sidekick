import {Role} from "./roleModel";
import {FIELD_NAMES as ROLE_FIELD_NAMES} from "models/roleModel";

const RESOURCE = 'actors'

const FIELD_NAMES = {
  ...ROLE_FIELD_NAMES,
  gender: undefined,
  height: undefined,
  weight: undefined,
  ethnicity: undefined,
  eye_color: undefined,
  hair_color: undefined,
  chest: undefined,
  waist: undefined,
  hips: undefined,
  neck: undefined,
  inseam: undefined,
  sleeve: undefined,
  shoe_size: undefined,
  character_ids: []
}

export class Actor extends Role {

  constructor(store = null, field_names = FIELD_NAMES, resource = RESOURCE) {
    super(store, field_names, resource)
  }
}
