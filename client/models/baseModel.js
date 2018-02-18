import {computed, extendObservable, isObservable, isObservableArray, observable, transaction} from 'mobx'
import {camelCase, reject, remove, sortBy} from 'lodash'
import {RESOURCES} from "../constants";
import {arrayMove} from "react-sortable-hoc";
import {addIdToResource, pluralizeResource} from "../helpers";
import {createViewModel} from 'mobx-utils'

class BaseModel {

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

  get relationships() {
    return this.constructor.RELATIONSHIPS
  }

  get field_names() {
    return this.constructor.FIELD_NAMES
  }

  get resource() {
    // costumes
    return this.constructor.RESOURCE
  }

  get resourceSingular() {
    // costume
    return this.resource.slice(0, -1)
  }

  get resourceId() {
    // costume_ids
    return `${this.resourceSingular}_ids`
  }

  get singularResourceId() {
    // costume_id
    return this.resourceId.slice(0, -1)
  }

  get resourceIdCamelCased() {
    // costumeIds
    return camelCase(this.resourceId)
  }

  get singularResourceIdCamelCased() {
    // costumeId
    return camelCase(this.singularResourceId)
  }

  get tableColumns() {
    return this.constructor.tableColumns
  }


  constructor(store) {
    this.store = store

    this.save = this.save.bind(this)
    this._initializeFields = this._initializeFields.bind(this)
    this._initializeRelationships = this._initializeRelationships.bind(this)
    this.revert = this.revert.bind(this)
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
    for (let [relationship, backRef] of Object.entries(this.relationships)) {
      const pluralizedRelationship = pluralizeResource(relationship) // costumes
      const isHasManyRelationship = relationship === pluralizedRelationship
      const relationshipId = addIdToResource(relationship)
      const backRefId = addIdToResource(backRef)
      extendObservable(this, {
        get [relationship]() {
          const results = this.store[pluralizedRelationship].filter(item => {
            const primaryRefIds = isObservableArray(this[relationshipId]) ? this[relationshipId] : [this[relationshipId]]
            const backRefIds = isObservableArray(item[backRefId]) ? item[backRefId] : [item[backRefId]]

            if (this.updated_at > item.updated_at) {
              return primaryRefIds.includes(item.id)
            } else {
              return backRefIds.includes(this.id)
            }
          })
          return isHasManyRelationship ? results : (results[0] || {})
        },
        get [camelCase(relationshipId)]() {  // costumeId
          if (this.viewModel) {
            return this.viewModel[relationshipId]
          } else {
            return isHasManyRelationship ? this[relationship].map(n => n.id) : this[relationship].id
          }
        },
        set [camelCase(relationshipId)](newValue) {
          this.viewModel[relationshipId] = newValue
        }
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
    })
  }

  addImage(imageUrl) {
    this.viewModel.images = this.viewModel.images.concat(
      [{
        image_src: {url: imageUrl},
        name: null,
        id: null,
        primary: this.viewModel.images.length === 0
      }]
    )
  }

  removeImage(imageUrl) {
    this.viewModel.images = reject(this.viewModel.images, image => image.image_src.url === imageUrl)
  }

  setPrimaryImage(imageUrl) {
    this.viewModel.images = this.viewModel.images.map(image => {
      image.primary = image.image_src.url === imageUrl;
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
    this.viewModel.reset()
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
        this.modified = false
      })
  }

  destroy() {
    const method = 'delete'
    const apiEndpoint = RESOURCES[this.resource].apiEndpoint + `/${this.id}`

    this.store._api(apiEndpoint, method).then(
      response => {
        transaction(() => {
          if (!response[this.resource]) {
            return
          }
          response[this.resource].forEach(json => {
            this.store._updateResourceFromServer(json, this.resource)
          })
        })
      }
    )
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
  set: (target, name, newValue) => {
    if (!(name in target)) {
      target.model[name] = newValue
      return true
    } else {
      target[name] = newValue
      return true
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


export default BaseModel
