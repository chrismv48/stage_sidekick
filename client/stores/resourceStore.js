import {action, observable, transaction} from 'mobx'
import {difference, sortBy} from "lodash";
import {arrayMove} from "react-sortable-hoc";
import {pluralizeResource} from "../helpers";
import SceneModel from "models/sceneModel";
import CharacterModel from "models/characterModel";
import RoleModel from "models/roleModel";
import CostumeModel from "models/costumeModel";
import CostumeItemModel from "models/costumeItemModel";
import ActorModel from "models/actorModel";
import StageActionModel from "models/stageActionModel";
import NoteModel from "models/noteModel";


class ResourceStore {

  @observable characters = []
  @observable scenes = []
  @observable roles = []
  @observable actors = []
  @observable costumes = []
  @observable costume_items = []
  @observable stage_actions = []
  @observable notes = []

  @observable isLoading = false

  @observable setupAlerts = []
  @observable scriptOptions = null
  @observable scriptSuccessCounts = {}

  // @observable scriptSearchResults = []

  get resources() {
    return this.constructor.resources
  }

  constructor(api, rootStore) {
    this._api = api
    this.rootStore = rootStore

    this.getStagedResource = this.getStagedResource.bind(this)
    this.dropdownOptions = this.dropdownOptions.bind(this)
    this.searchScript = this.searchScript.bind(this)

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

  loadStageActions(idOrIds = null, options = {}) {
    return this.loadResource('stage_actions', idOrIds, options)
  }

  loadSetupAlerts() {
    return this._api('setup_alerts').then(results => {
      this.setupAlerts = results
    })
  }

  searchScript(query) {
    const queryParam = {query}
    return this._api('stage_actions', 'GET', null, queryParam).then(results => {
      return results
    })
  }

  parseScript(options) {
    return this._api('script_importer/parse', 'POST', options).then(results => {
      this.scriptOptions = results
    })
  }

  submitScriptOptions(options) {
    return this._api('script_importer/generate', 'POST', options).then(results => {
      this.scriptSuccessCounts = results
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

  @action loadResource(resource, idOrIds = null, params = {}) {
    let apiEndpoint = resource

    if (Array.isArray(idOrIds)) {
      apiEndpoint = `${apiEndpoint}?ids=${idOrIds.join(',')}`
    } else if (Number.isInteger(idOrIds)) {
      apiEndpoint = `${apiEndpoint}/${idOrIds}`
    }

    return this._api(apiEndpoint, 'GET', null, params).then(action("loadResource", response => {
      if (resource === 'stage_actions') {
        this.stageActionsTotalCount = response.total_count
        this.scenesWithStageAction = response.scenes_with_stage_action
        this[resource] = [] // we want to overwrite, not append to stage actions
      }
      response[resource].forEach(json => {
        this._updateResourceFromServer(json, resource)
      });

      this[resource] = sortBy(this[resource], n => n.order_index)
    }))
  }

  @action _updateResourceFromServer(json, resource) {
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

  @action updateOrderIndex(resource, oldIndex, newIndex) {
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
  'stage_actions': StageActionModel,
  'costume_items': CostumeItemModel,
  'notes': NoteModel
}

export default ResourceStore
