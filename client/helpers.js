import _ from 'lodash'

const PLURALITY_RESOURCE_MAPPING = {
  'user': 'users',
  'character': 'characters',
  'scene': 'scenes',
  'role': 'roles',
  'costume': 'costumes'
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
