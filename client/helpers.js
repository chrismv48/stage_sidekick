import _ from 'lodash'

const PLURALITY_RESOURCE_MAPPING = {
  'user': 'users',
  'character': 'characters',
  'scene': 'scenes',
  'role': 'roles',
  'costume': 'costumes',
  'costume_item': 'costume_items'
}

export function swapPlurality(resource) {
  return PLURALITY_RESOURCE_MAPPING[resource] || _.invert(PLURALITY_RESOURCE_MAPPING)[resource]
}

export function pluralizeResource(resource) {
  return PLURALITY_RESOURCE_MAPPING[resource] || resource
}

export function singularizeResource(resource) {
  return _.invert(PLURALITY_RESOURCE_MAPPING)[resource] || resource
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