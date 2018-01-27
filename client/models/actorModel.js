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
  costumes_characters_scenes: []
}

const RELATIONSHIPS = {
  characters: 'actors',
  costumes: 'actors'
}

export class Actor extends Role {

  constructor(store = null, field_names = FIELD_NAMES, relationships = RELATIONSHIPS, resource = RESOURCE) {
    super(store, field_names, relationships, resource)

    // boilerplate constructor calls are handled by parent Role class
  }
}
