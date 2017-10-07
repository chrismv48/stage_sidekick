export const fetchResource = (resource, endpoint) => {
  console.log(`FETCH_${resource.toUpperCase()}`)
  return {
    type: `FETCH_${resource.toUpperCase()}`,
    resource,
    endpoint
  }
}

export const createResource = (resource, endpoint, payload) => {
  console.log(`CREATE_${resource.toUpperCase()}`)
  return {
    type: `CREATE_${resource.toUpperCase()}`,
    resource,
    endpoint,
    payload
  }
}

export const modifyResource = (resource, endpoint, payload) => {
  console.log(`MODIFY_${resource.toUpperCase()}`)
  return {
    type: `MODIFY_${resource.toUpperCase()}`,
    resource,
    endpoint,
    payload
  }
}

export const deleteResource = (resource, endpoint) => {
  console.log(`DESTROY${resource.toUpperCase()}`)
  return {
    type: `DESTROY_${resource.toUpperCase()}`,
    resource,
    endpoint
  }
}

export const updateResourceFields = (resource, field, value, resourceId=null) => {
  console.log(`UPDATE_${resource.toUpperCase()}_FORM_FIELDS`)
  return {
    type: `UPDATE_${resource.toUpperCase()}_FORM_FIELDS`,
    resource,
    field,
    value,
    resourceId
  }
}

export const sortResource = (resource, field, direction) => {
  return {
    type: `SORT_${resource.toUpperCase()}`,
    resource,
    field,
    direction
  }
}

export const updateResourceOrderIndex = (resource, newOrder) => {
  return {
    type: `UPDATE_${resource.toUpperCase()}_ORDER_INDEX`,
    resource,
    newOrder
  }
}

export const swapResourceOrderIndex = (resource, oldIndex, newIndex) => {
  return {
    type: `SWAP_RESOURCE_ORDER_INDEX`,
    resource,
    oldIndex,
    newIndex
  }
}
