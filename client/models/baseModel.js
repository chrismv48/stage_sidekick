import {computed, extendObservable, isObservable, observable, transaction} from 'mobx'
import {get, isArray, isEmpty, isObject, isString, pull, reject, remove, sortBy} from 'lodash'
import {RESOURCES} from "../constants";
import {arrayMove} from "react-sortable-hoc";
import {addIdToResource, pluralizeResource} from "../helpers";
import {createViewModel} from 'mobx-utils'

export class BaseModel {

  @observable modified = false // this can probably be computed?

  @computed get primaryImage() {
    const primary_image = this.images.find(image => image.primary)
    return primary_image ? primary_image.image_src.url : null
  }

  @computed get avatar() {
    const primary_image = this.images.find(image => image.primary)
    return primary_image ? primary_image.image_src.thumbnail.url : null
  }

  @computed get cardImage() {
    const primary_image = this.images.find(image => image.primary)
    return primary_image ? primary_image.image_src.card.url : null
  }

  get viewModel() {
    if (!this._viewModel) {
      const viewModel = createViewModel(this)
      this._viewModel = new Proxy(viewModel, handler)
    }
    return this._viewModel
  }

  set viewModel(newValue) {
    this._viewModel = newValue
  }

  constructor(store, field_names, relationships, resource,) {
    this.store = store
    this.field_names = field_names
    this.resource = resource
    this.relationships = relationships

    this.save = this.save.bind(this)
    this._initializeFields = this._initializeFields.bind(this)
    this._initializeRelationships = this._initializeRelationships.bind(this)
  }

  _initializeFields() {
    let resource = this
    for (const [field, default_value] of Object.entries(this.field_names)) {
      extendObservable(resource, {
        [field]: default_value
      })
    }
  }

  _initializeRelationships() {
    for (let relationship of Object.keys(this.relationships)) {
      const relationshipIdField = addIdToResource(relationship)
      let idFieldDefaultValue
      let defaultValue
      if (pluralizeResource(relationship) === relationship) {
        idFieldDefaultValue = []
        defaultValue = []
      } else {
        idFieldDefaultValue = null
        defaultValue = {}
      }
      extendObservable(this, {
        [relationship]: defaultValue,
        [relationshipIdField]: idFieldDefaultValue
      })
    }
  }

  updateFromObject(attributes) {
    transaction(() => {
      Object.keys(this.field_names).forEach(field => {
        if (attributes[field] !== undefined) {
          this[field] = attributes[field]
        }
      })
      Object.entries(this.relationships).forEach(([relationship, backRef]) => {
        let objectRelationship = attributes[relationship]
        if (!isEmpty(objectRelationship)) {
          const relationshipIdField = addIdToResource(relationship)
          // we have to handle multiple vs single object relationships differently
          if (isArray(objectRelationship)) {
            objectRelationship.forEach(item => {
              this.store._updateResourceFromServer(item, pluralizeResource(relationship))
              const relationshipRef = this.store[pluralizeResource(relationship)].find(r => r.id === item.id)
              this._updateBackRef(relationshipRef, backRef)
            })

            this[relationship] = this.store[pluralizeResource(relationship)].filter(entity => objectRelationship.map(r => r.id).includes(entity.id))
            this[relationshipIdField] = this[relationship].map(r => r.id)

          } else {
            this.store._updateResourceFromServer(objectRelationship, pluralizeResource(relationship))
            this[relationship] = this.store[pluralizeResource(relationship)].find(entity => entity.id === objectRelationship.id)
            this[relationshipIdField] = this[relationship].id

            const relationshipRef = this.store[pluralizeResource(relationship)].find(r => r.id === objectRelationship.id)
            this._updateBackRef(relationshipRef, backRef)
          }
        }
      })
    })
  }

  _updateBackRef(relationshipRef, backRef) {
    if (relationshipRef[backRef] === undefined) { return }

    if (pluralizeResource(backRef) === backRef) {
      if (!relationshipRef[backRef].map(r => r.id).includes(this.id)) {
        relationshipRef[backRef].push(this)
        relationshipRef[addIdToResource(backRef)].push(this.id)
      }
    } else {
      relationshipRef[backRef] = this
      relationshipRef[addIdToResource(backRef)] = this.id
    }
  }

  addImage(imageUrl) {
    this.viewModel.images = [{
      image_src: { url: imageUrl},
      name: null,
      id: null
    }].concat(this.viewModel.images.toJS())
  }

  removeImage(imageUrl) {
    this.viewModel.images = reject(this.viewModel.images, image => image.image_src.url === imageUrl)
  }

  setPrimaryImage(imageId) {
    this.viewModel.images = this.viewModel.images.toJS().map(image => {
      image.primary = image.id === imageId;
      return image
    })
  }

  updateImageOrder(oldIndex, newIndex) {
    const newOrder = arrayMove(this.images.map(image => image.id), oldIndex, newIndex)
    transaction(() => {
      for (let image of this.images) {
        image.order_index = newOrder.indexOf(image.id)
      }
      this.images = sortBy(this.images, image => image.order_index)
    })
  }

  revert() {
    delete this._viewModel
    this.modified = false
  }

  getDirty() {
    const payload = {}
    Object.keys(Object.assign({}, this.field_names, this.relationships)).forEach(field => {
      if (field in this.relationships) {
        field = addIdToResource(field)
      }
      if (this.viewModel.isPropertyDirty(field)) {
        payload[field] = this.viewModel[field]
      }
    })
    return payload
  }

  save() {
    if (!this.viewModel.isDirty) {
      return
    }

    let payload = this.getDirty()

    let method = 'POST'
    let apiEndpoint = RESOURCES[this.resource].apiEndpoint

    if (this.id) {
      method = 'PUT'
      apiEndpoint += `/${this.id}`
    }

    this.store._api(apiEndpoint, method, payload).then(
      response => {
        transaction(() => {
          response[this.resource].forEach(json => {
            this.store._updateResourceFromServer(json, this.resource)
          })
        })
        // Remove view model
        delete this._viewModel
        this.modified = false
      })
  }

  destroy() {
    const method = 'delete'
    const apiEndpoint = RESOURCES[this.resource].apiEndpoint + `/${this.id}`

    this.store._api(apiEndpoint, method).then(
      response => {
        transaction(() => {
          if (!response[this.resource]) { return }
          response[this.resource].forEach(json => {
            this.store._updateResourceFromServer(json, this.resource)
          })
        })
      }
    )
    // Remove references from relationships
    Object.entries(this.relationships).forEach(([relationship, backRef]) => {
      const pluralizedRelationship = pluralizeResource(relationship)
      debugger
      this.store[pluralizedRelationship].forEach(entity => {
        if (pluralizeResource(backRef) === backRef) {
          debugger
          remove(entity[backRef], (n) => n.id === this.id)
          pull(entity[addIdToResource(backRef)], this.id)
        } else {
          entity[backRef] = {}
          entity[addIdToResource(backRef)] = null
        }
      })
    })
    remove(this.store[this.resource], (n) => n.id === this.id)
  }
}

const handler = {
  get: function (target, name) {
    if (!(name in target)) {
      return target.model[name]
    } else {
      return target[name]
    }
  },
  apply: function (target, name, args) {
    if (!(name in target)) {
      return target.model.call(name, args)
    } else {
      return target.call(name, args)
    }
  }
};
