export const fetchResource = (entity, endpoint) => {
  console.log(`FETCH_${entity.toUpperCase()}`)
  return {
    type: `FETCH_${entity.toUpperCase()}`,
    entity,
    endpoint
  }
}

export const createResource = (entity, endpoint, payload) => {
  console.log(`CREATE_${entity.toUpperCase()}`)
  return {
    type: `CREATE_${entity.toUpperCase()}`,
    entity,
    endpoint,
    payload
  }
}

export const modifyResource = (entity, endpoint, payload) => {
  console.log(`MODIFY_${entity.toUpperCase()}`)
  return {
    type: `MODIFY_${entity.toUpperCase()}`,
    entity,
    endpoint,
    payload
  }
}

export const deleteResource = (entity, endpoint) => {
  console.log(`DESTROY${entity.toUpperCase()}`)
  return {
    type: `DESTROY_${entity.toUpperCase()}`,
    entity,
    endpoint
  }
}

export const updateResourceFields = (entity, field, value, resourceId=null) => {
  console.log(`UPDATE_${entity.toUpperCase()}_FORM_FIELDS`)
  return {
    type: `UPDATE_${entity.toUpperCase()}_FORM_FIELDS`,
    entity,
    field,
    value,
    resourceId
  }
}
