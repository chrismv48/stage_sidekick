import {computed, observable, toJS, transaction} from 'mobx'
import {difference, sortBy} from "lodash";
import {
  ACTOR_RESOURCE, CHARACTER_RESOURCE, COSTUME_ITEM_RESOURCE, COSTUME_RESOURCE, LINE_RESOURCE, RESOURCES,
  ROLE_RESOURCE, SCENE_RESOURCE
} from "../constants";
import {arrayMove} from "react-sortable-hoc";

export class ResourceStore {

  @observable characters = []
  @observable scenes = []
  @observable roles = []
  @observable actors = []
  @observable costumes = []
  @observable costume_items = []
  @observable lines = []

  @observable isLoading = false

  constructor(api, rootStore) {
    this._api = api
    this.rootStore = rootStore

    this.getStagedResource = this.getStagedResource.bind(this)
  }

  resolveResource(idOrIds, resource) {
    let notFoundIds = idOrIds
    if (Array.isArray(idOrIds)) {
      let result = this[resource].toJS().filter(entity => idOrIds.includes(entity.id))
      notFoundIds = difference(idOrIds, result.map(result => result.id))

      if (notFoundIds.length === 0) return result

    } else {
      let result = this[resource].find(entity => idOrIds.includes(entity.id))
      if (result) return result
    }
    this.loadResource(resource, notFoundIds)
  }

  loadCharacters(idOrIds = null) {
    return this.loadResource(CHARACTER_RESOURCE, idOrIds)
  }

  loadScenes(idOrIds = null) {
    return this.loadResource(SCENE_RESOURCE, idOrIds)
  }

  loadRoles(idOrIds = null) {
    return this.loadResource(ROLE_RESOURCE, idOrIds)
  }

  loadActors(idOrIds = null) {
    return this.loadResource(ACTOR_RESOURCE, idOrIds)
  }

  loadCostumes(idOrIds = null) {
    return this.loadResource(COSTUME_RESOURCE, idOrIds)
  }

  loadCostumeItems(idOrIds = null) {
    return this.loadResource(COSTUME_ITEM_RESOURCE, idOrIds)
  }

  loadLines(idOrIds = null) {
    return this.loadResource(LINE_RESOURCE, idOrIds)
  }

  getStagedResource(resource, id = null) {
    if (id) {
      return this[resource].find(resource => resource.id === id)
    }
    const resourceObj = RESOURCES[resource]
    const stagedResource = `${resourceObj.singularized}Staged`
    if (!this[stagedResource]) {
      this[stagedResource] = new resourceObj.model(this)
    }

    return this[stagedResource]
  }

  loadResource(resource, idOrIds = null, params = null) {
    let apiEndpoint = resource

    if (Array.isArray(idOrIds)) {
      apiEndpoint = `${apiEndpoint}?ids=${idOrIds.join(',')}`
    } else if (Number.isInteger(idOrIds)) {
      apiEndpoint = `${apiEndpoint}/${idOrIds}`
    }

    this.isLoading = true
    return this._api(apiEndpoint, 'GET', null, params).then(
      entities => {
        transaction(() => {
          debugger
          entities[resource].forEach(json => {
            this._updateResourceFromServer(json, resource)
          });
          this[resource] = sortBy(this[resource], n => n.order_index)
        })
        this.isLoading = false
      })
  }

  _updateResourceFromServer(json, resource) {
    const resourceModel = RESOURCES[resource].model
    let entity = this[resource].find(entity => entity.id === json.id)

    if (!entity) {
      entity = new resourceModel(this)
      entity.updateFromObject(json)
      this[resource].push(entity)
    } else {
      entity.updateFromObject(json)
    }
  }

  updateOrderIndex(resource, oldIndex, newIndex) {
    const newOrder = arrayMove(this[resource].map(resource => resource.id), oldIndex, newIndex)
    transaction(() => {
      for (let resource of this[`${resource}`]) {
        resource.order_index = newOrder.indexOf(resource.id)
      }
      this[resource] = sortBy(this[resource], resource => resource.order_index)
    })
    const payload = {order_index_swap: newOrder}
    this._api(resource, 'POST', payload)
  }

}
