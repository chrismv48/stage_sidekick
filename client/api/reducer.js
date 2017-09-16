// Sample state shape:
// const state = {
//   characters: {
//     byId: {
//       1: {
//         id: 1,
//         name: "Chris"
//       },
//       2: {
//         id: 2,
//         name: "John"
//       }
//     },
//     allIds: [1, 2],
//     loading: false,
//     errors: null,
//     staging: {
//       1: {name: 'Chris v2'}
//     }
//   }
// }

import {
  ACTION_RESOURCE_COMPLETED,
  ACTION_RESOURCE_FAILED,
  ACTION_RESOURCE_INITIATED,
  ACTION_RESOURCE_SUCCEEDED,
} from "./sagas"

const _ = require('lodash/fp');

function apiReducer(state = {}, action) {
  console.log(`Reducer received action: ${action.type}`)
  let {resource, response, error} = action
  resource = resource || 'resource'
  switch (action.type) {
    case ACTION_RESOURCE_INITIATED('get', resource):
    case ACTION_RESOURCE_INITIATED('put', resource):
    case ACTION_RESOURCE_INITIATED('post', resource):
    case ACTION_RESOURCE_INITIATED('delete', resource):
      return _.set(`${resource}.loading`, true, state)
    case ACTION_RESOURCE_SUCCEEDED('get', resource):
    case ACTION_RESOURCE_SUCCEEDED('put', resource):
    case ACTION_RESOURCE_SUCCEEDED('post', resource):
    case ACTION_RESOURCE_SUCCEEDED('delete', resource):
      let newState = _.mergeWith(customizer, state, response)
      newState[resource].loading = false
      newState[resource].success = true
      newState[resource].error = null
      return newState
    case ACTION_RESOURCE_FAILED('get', resource):
    case ACTION_RESOURCE_FAILED('put', resource):
    case ACTION_RESOURCE_FAILED('post', resource):
    case ACTION_RESOURCE_FAILED('delete', resource):
      return {...state, [resource]: {loading: false, error: error}}
    case ACTION_RESOURCE_COMPLETED('get', resource):
    case ACTION_RESOURCE_COMPLETED('put', resource):
    case ACTION_RESOURCE_COMPLETED('post', resource):
    case ACTION_RESOURCE_COMPLETED('delete', resource):
      // TODO: right now this deletes staging entirely. If we ever want to stage multiple objects, we'll need to refine this.
      return _.omit([`${resource}.success`, `${resource}.staging`], state)
    case `UPDATE_${resource.toUpperCase()}_FORM_FIELDS`:
      let {resourceId, field, value} = action
      return _.set(`${resource}.staging.${resourceId || null}.${field}`, value, state)
    case `SORT_${resource.toUpperCase()}`:
      const resourceByIds = _.get(`${resource}.byId`, state, {})
      const sortedResource = _.orderBy([action.field], action.direction, Object.values(resourceByIds))
      return _.set(`${resource}.allIds`, _.map('id', sortedResource), state)
    default:
      return state
  }
}

export default apiReducer

function customizer(srcValue, objValue, key) {
  if (_.isArray(srcValue)) {
    if (key === 'allIds') {
      return _.uniq(srcValue.concat(objValue));
    }
    else {
      return objValue
    }
  }
}
