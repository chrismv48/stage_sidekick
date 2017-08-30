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
  ACTION_RESOURCE_SUCCEEDED
} from "./sagas"

const _ = require('lodash/fp');

function apiReducer(state = {}, action) {
  console.log(`Reducer received action: ${action.type}`)
  let {entity, response, error} = action
  entity = entity || 'entity'
  switch (action.type) {
    case ACTION_RESOURCE_INITIATED('get', entity):
    case ACTION_RESOURCE_INITIATED('put', entity):
    case ACTION_RESOURCE_INITIATED('post', entity):
    case ACTION_RESOURCE_INITIATED('delete', entity):
      return _.set(`${entity}.loading`, true, state)
    case ACTION_RESOURCE_SUCCEEDED('get', entity):
    case ACTION_RESOURCE_SUCCEEDED('put', entity):
    case ACTION_RESOURCE_SUCCEEDED('post', entity):
    case ACTION_RESOURCE_SUCCEEDED('delete', entity):
      let newState = _.mergeWith({}, state, response, customizer)
      newState[entity].loading = false
      newState[entity].success = true
      newState[entity].error = null
      return newState
    case ACTION_RESOURCE_FAILED('get', entity):
    case ACTION_RESOURCE_FAILED('put', entity):
    case ACTION_RESOURCE_FAILED('post', entity):
    case ACTION_RESOURCE_FAILED('delete', entity):
      return {...state, [entity]: {loading: false, error: error}}
    case ACTION_RESOURCE_COMPLETED('get', entity):
    case ACTION_RESOURCE_COMPLETED('put', entity):
    case ACTION_RESOURCE_COMPLETED('post', entity):
    case ACTION_RESOURCE_COMPLETED('delete', entity):
      // TODO: right now this deletes staging entirely. If we ever want to stage multiple objects, we'll need to refine this.
      return _.omit([`${entity}.success`, `${entity}.staging`], state)
    case `UPDATE_${entity.toUpperCase()}_FORM_FIELDS`:
      const {resourceId, field, value} = action
      return _.set(`${entity}.staging.${resourceId || null}.${field}`, value, state)
    default:
      return state
  }
}

export default apiReducer

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return _.uniq(objValue.concat(srcValue));
  }
}
