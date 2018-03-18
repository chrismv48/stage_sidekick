import {computed, observable, toJS, transaction} from 'mobx'
import {difference, sortBy} from "lodash";
import {arrayMove} from "react-sortable-hoc";
import {pluralizeResource} from "../helpers";
import SceneModel from "models/sceneModel";
import CharacterModel from "models/characterModel";
import RoleModel from "models/roleModel";
import CostumeModel from "models/costumeModel";
import CostumeItemModel from "models/costumeItemModel";
import ActorModel from "models/actorModel";
import LineModel from "models/lineModel";
import NoteModel from "models/noteModel";


class ResourceStore {

  @observable characters = []
  @observable scenes = []
  @observable roles = []
  @observable actors = []
  @observable costumes = []
  @observable costume_items = []
  @observable lines = []
  @observable notes = []

  @observable isLoading = false

  @observable setupAlerts = []

  get resources() {
    return this.constructor.resources
  }

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

  loadNotes(idOrIds = null) {
    return this.loadResource('notes', idOrIds)
  }

  loadCharacters(idOrIds = null) {
    return this.loadResource('characters', idOrIds)
  }

  loadScenes(idOrIds = null) {
    return this.loadResource('scenes', idOrIds)
  }

  loadRoles(idOrIds = null) {
    return this.loadResource('roles', idOrIds)
  }

  loadActors(idOrIds = null) {
    return this.loadResource('actors', idOrIds)
  }

  loadCostumes(idOrIds = null) {
    return this.loadResource('costumes', idOrIds)
  }

  loadCostumeItems(idOrIds = null) {
    return this.loadResource('costume_items', idOrIds)
  }

  loadLines(idOrIds = null) {
    return this.loadResource('lines', idOrIds)
  }

  loadSetupAlerts() {
    return this._api('setup_alerts').then(results => {
      this.setupAlerts = results
    })
  }

  dropdownOptions(resource) {
    return this[resource].map(resource => resource.dropdownItem())
  }

  getStagedResource(resource, id = null) {
    if (id) {
      return this[resource].find(resource => resource.id === id).viewModel
    }
    const resourceObj = this.resources[resource]
    const stagedResource = `${resourceObj.resourceSingular}Staged`
    if (!this[stagedResource]) {
      this[stagedResource] = new resourceObj(this)
    }

    return this[stagedResource].viewModel
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
          entities[resource].forEach(json => {
            this._updateResourceFromServer(json, resource)
          });
          this[resource] = sortBy(this[resource], n => n.order_index)
        })
        this.isLoading = false
      })
  }

  _updateResourceFromServer(json, resource) {
    const pluralizedResource = pluralizeResource(resource)
    const resourceModel = this.resources[pluralizedResource]
    let entity = this[pluralizedResource].find(entity => entity.id === json.id)
    if (!entity) {
      entity = new resourceModel(this)
      entity.updateFromObject(json)
      this[pluralizedResource].push(entity)
    } else {
      entity.updateFromObject(json)
    }
  }

  updateOrderIndex(resource, oldIndex, newIndex) {
    const pluralizedResource = pluralizeResource(resource)
    const newOrder = arrayMove(this[pluralizedResource].map(resource => resource.id), oldIndex, newIndex)
    transaction(() => {
      for (let resource of this[`${pluralizedResource}`]) {
        resource.order_index = newOrder.indexOf(resource.id)
      }
      this[pluralizedResource] = sortBy(this[resource], resource => resource.order_index)
    })
    const payload = {order_index_swap: newOrder}
    this._api(pluralizedResource, 'POST', payload)
  }

}

ResourceStore.resources = {
  'characters': CharacterModel,
  'scenes': SceneModel,
  'costumes': CostumeModel,
  'actors': ActorModel,
  'roles': RoleModel,
  'lines': LineModel,
  'costume_items': CostumeItemModel,
  'notes': NoteModel
}

export default ResourceStore
