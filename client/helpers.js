import {camelCase, invert} from 'lodash'

const PLURALITY_RESOURCE_MAPPING = {
  'user': 'users',
  'character': 'characters',
  'scene': 'scenes',
  'role': 'roles',
  'costume': 'costumes',
  'costume_item': 'costume_items',
  'user_id': 'user_ids',
  'character_id': 'character_ids',
  'scene_id': 'scene_ids',
  'role_id': 'role_ids',
  'costume_id': 'costume_ids',
  'costume_item_id': 'costume_item_ids',
  'line': 'lines',
  'line_id': 'line_ids',
  'actor': 'actors',
  'actor_id': 'actor_ids'
}

export function swapPlurality(resource) {
  return PLURALITY_RESOURCE_MAPPING[resource] || invert(PLURALITY_RESOURCE_MAPPING)[resource]
}

export function pluralizeResource(resource) {
  return PLURALITY_RESOURCE_MAPPING[resource] || resource
}

export function singularizeResource(resource) {
  return invert(PLURALITY_RESOURCE_MAPPING)[resource] || resource
}

export function addIdToResource(resource) {
  const singularizedResource = singularizeResource(resource)
  if (singularizedResource === resource) {
    return singularizedResource + '_id'
  }
  else {
    return singularizedResource + '_ids'
  }
}

export function singularResourceIdCamelCased(resource) {
  return camelCase(singularizeResource(resource)) + 'Id'
}


