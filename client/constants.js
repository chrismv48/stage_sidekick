import {Scene} from "./models/sceneModel";
import {Character} from "./models/characterModel";
import {Role} from "./models/roleModel";
import {Costume} from "./models/costumeModel";
import {CostumeItem} from "./models/costumeItemModel";
import {Actor} from "./models/actorModel";
import {Line} from "./models/lineModel";

export const CHARACTER_RESOURCE = 'characters'
export const SCENE_RESOURCE = 'scenes'
export const ROLE_RESOURCE = 'roles'
export const ACTOR_RESOURCE = 'actors'
export const COSTUME_RESOURCE = 'costumes'
export const COSTUME_ITEM_RESOURCE = 'costume_items'
export const LINE_RESOURCE = 'lines'

export const RESOURCES = {
  [CHARACTER_RESOURCE]: {
    apiEndpoint: 'characters',
    pluralized: 'characters',
    singularized: 'character',
    model: Character
  },
  [SCENE_RESOURCE]: {
    apiEndpoint: 'scenes',
    pluralized: 'scenes',
    singularized: 'scene',
    model: Scene
  },
  [ROLE_RESOURCE]: {
    apiEndpoint: 'roles',
    pluralized: 'roles',
    singularized: 'role',
    model: Role
  },
  [COSTUME_RESOURCE]: {
    apiEndpoint: 'costumes',
    pluralized: 'costumes',
    singularized: 'costume',
    model: Costume
  },
  [COSTUME_ITEM_RESOURCE]: {
    apiEndpoint: 'costume_items',
    pluralized: 'costume_items',
    singularized: 'costume_item',
    model: CostumeItem
  },
  [ACTOR_RESOURCE]: {
    apiEndpoint: 'actors',
    pluralized: 'actors',
    singularized: 'actor',
    model: Actor
  },
  [LINE_RESOURCE]: {
    apiEndpoint: 'lines',
    pluralized: 'lines',
    singularized: 'line',
    model: Line
  }
}

// FORM CONSTANTS

export const relationshipsByResource = {
  'scenes': ['characters'],
  'roles': [],
  'characters': ['scenes', 'roles'],
  'costume_items': ['costumes'],
  'actors': ['characters']
}

export const relationshipIdToLabel = {
  'scene_ids': 'scenes',
  'role_ids': 'roles',
  'character_ids': 'characters',
  'costume_ids': 'costumes',
  'costume_id': 'costume',
}

export const employmentTypes = [
  {
    text: 'Full-time',
    value: 'Full-time',
  },
  {
    text: 'Part-time',
    value: 'Part-time',
  },
  {
    text: 'Contractor',
    value: 'Contractor',
  },
]

export const departments = ['Production', 'Costumes', 'Acting', 'Administration', 'Sound', 'Lighting']

export const itemTypes = [
  'Shirt',
  'Pants',
  'Jacket',
  'Shoes',
  'Hat',
  'Belt',
  'Dress'
]

export const sceneFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image_upload',
  },
  {
    fieldName: 'title',
    inputType: 'text',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'setting',
    inputType: 'text',
  },
  {
    fieldName: 'length_in_minutes',
    inputType: 'text',
  },
  {
    fieldName: 'character_ids',
    label: 'Characters',
    inputType: 'dropdown',
    dropdownText: 'name',
  },
]

export const characterFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image_upload',
  },
  {
    fieldName: 'name',
    inputType: 'text',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'scene_ids',
    label: 'Scenes',
    inputType: 'dropdown',
    dropdownText: 'title',
  },
  {
    fieldName: 'role_ids',
    label: 'Played by',
    inputType: 'dropdown',
    dropdownText: (role) => `${role.first_name} ${role.last_name}`,
  },
]

export const costumeItemFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image_upload',
  },
  {
    fieldName: 'title',
    inputType: 'text',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'item_type',
    label: 'Type',
    inputType: 'dropdown',
    inputOptions: {
      options: itemTypes.map(item_type => {
        return {text: item_type, value: item_type}
      }),
      multiple: false,
    },
  },
  {
    fieldName: 'costume_id',
    label: 'Costume',
    inputType: 'dropdown',
    dropdownText: 'title',
  },
]

export const roleFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image_upload',
  },
  {
    fieldName: 'first_name',
    inputType: 'text',
  },
  {
    fieldName: 'last_name',
    inputType: 'text',
  },
  {
    fieldName: 'title',
    inputType: 'text',
  },
  {
    fieldName: 'department',
    inputType: 'dropdown',
    inputOptions: {
      options: departments.map(department => {
        return {text: department, value: department}
      }),
    },
  },
  {
    fieldName: 'role_type',
    label: 'Employment Type',
    inputType: 'dropdown',
    inputOptions: {
      options: employmentTypes,
    },
  },
]

export const actorProfileFields = [
  'gender',
  'height',
  'weight',
  'ethnicity',
  'eye_color',
  'hair_color',
]

export const actorMeasurementFields = [
  'chest',
  'waist',
  'hips',
  'neck',
  'inseam',
  'sleeve',
  'shoe_size'
]

export const actorFormFields = [
  {
    fieldName: 'display_image',
    inputType: 'image_upload',
  },
  {
    fieldName: 'fullName',
    inputType: 'text',
    inputOptions: {disabled: true}
  },
  {
    fieldName: 'character_ids',
    label: 'Characters',
    inputType: 'dropdown',
    dropdownText: 'name',
  },
  {
    fieldName: 'description',
    inputType: 'textarea',
  },
  {
    fieldName: 'gender',
    inputType: 'text',
  },
  {
    fieldName: 'height',
    inputType: 'text',
  },
  {
    fieldName: 'weight',
    inputType: 'text',
  },
  {
    fieldName: 'ethnicity',
    inputType: 'text',
  },
  {
    fieldName: 'eye_color',
    inputType: 'text',
  },
  {
    fieldName: 'hair_color',
    inputType: 'text',
  },
  {
    fieldName: 'chest',
    inputType: 'text',
  },
  {
    fieldName: 'waist',
    inputType: 'text',
  },
  {
    fieldName: 'hips',
    inputType: 'text',
  },
  {
    fieldName: 'neck',
    inputType: 'text',
  },
  {
    fieldName: 'inseam',
    inputType: 'text',
  },
  {
    fieldName: 'sleeve',
    inputType: 'text',
  },
  {
    fieldName: 'shoe_size',
    inputType: 'text',
  },
]

export const formFieldsByResource = {
  'scenes': sceneFormFields,
  'roles': roleFormFields,
  'characters': characterFormFields,
  'costume_items': costumeItemFormFields,
  'actors': actorFormFields,
}
