import * as _ from "lodash";
import {pluralizeResource} from "../helpers";

const Api = (endpoint, method = 'get', payload = null) => {
  const fetchOptions = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (payload) {
    payload.production_id = 1
    fetchOptions.body = JSON.stringify(payload)
  }
  return fetch(`http://localhost:3005/${endpoint}`, fetchOptions)
    .then(response => {
      return response.json()
        // .then(data => normalize(data))
    })
    .catch(error => {
      throw error;
    })
};

export default Api


function normalize(response) {
  if (!response.result) {
    return response
  }
  let normalizedResult = {}
  let {relationships, result, resource} = response
  result = _.isArray(result) ? result : [result]
  debugger
  for (let item of result) {
    normalizedResult[resource] = normalizedResult[resource] || {byId: {}, allIds: []}
    let resourceNormalized = normalizedResult[resource]
    resourceNormalized['byId'][item.id] = item
    resourceNormalized['allIds'].push(item.id)
    for (let relationship of relationships) {
      const pluralizedRelationship = pluralizeResource(relationship)
      normalizedResult[pluralizedRelationship] = normalizedResult[pluralizedRelationship] || {byId: {}, allIds: new Set()}
      let relationshipNormalized = normalizedResult[pluralizedRelationship]
      let relationshipIds = []
      let relationshipItems = _.isArray(item[relationship]) ? item[relationship] : [item[relationship]]
      for (let relationshipItem of relationshipItems) {
        relationshipNormalized['byId'][relationshipItem.id] = relationshipItem
        relationshipNormalized['allIds'].add(relationshipItem.id)
        relationshipIds.push(relationshipItem.id)
      }
      resourceNormalized['byId'][item.id][relationship] = relationshipIds
    }
  }
  for (let key of Object.keys(normalizedResult)) {
    normalizedResult[key].allIds = Array.from(normalizedResult[key].allIds)
  }
  return normalizedResult
}
