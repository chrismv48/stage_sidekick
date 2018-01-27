import {computed, extendObservable, observable, transaction} from 'mobx'
import {get, isArray, isEmpty, isObject, isString, reject, remove, sortBy} from 'lodash'
import {RESOURCES} from "../constants";
import {arrayMove} from "react-sortable-hoc";
import {addIdToResource, pluralizeResource} from "../helpers";

export class BaseModel {

  @observable modified = false // this can probably be computed?

  @computed get primaryImage() {
    const primary_image = this._images.find(image => image.primary)
    return primary_image ? primary_image.image_src.url : null
  }

  @computed get avatar() {
    const primary_image = this._images.find(image => image.primary)
    return primary_image ? primary_image.image_src.thumbnail.url : null
  }

  @computed get cardImage() {
    const primary_image = this._images.find(image => image.primary)
    return primary_image ? primary_image.image_src.card.url : null
  }

  constructor(store, field_names, relationships, resource,) {
    this.store = store
    this.field_names = field_names
    this.resource = resource
    this.relationships = relationships

    this.save = this.save.bind(this)
    this.asJson = this.asJson.bind(this)
    this._initializeFields = this._initializeFields.bind(this)
    this._initializeRelationships = this._initializeRelationships.bind(this)
  }

  _initializeFields() {
    let resource = this
    for (const [field, default_value] of Object.entries(this.field_names)) {
      extendObservable(resource, {[`_${field}`]: default_value})
      Object.defineProperty(resource, field, {
        get: function () {
          return resource[`_${field}`]
        },
        set: function (newValue) {
          if (resource[`orig_${field}`] === undefined) {
            resource[`orig_${field}`] = resource[`_${field}`]
            resource.modified = true
          }
          resource[`_${field}`] = newValue
        }
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
        [`_${relationshipIdField}`]: idFieldDefaultValue,
        get [relationshipIdField]() {
          return this[`_${relationshipIdField}`]
        },
        set [relationshipIdField](newValue) {
          if (this[`orig_${relationshipIdField}`] === undefined) {
            this[`orig_${relationshipIdField}`] = this[`_${relationshipIdField}`]
            this.modified = true
          }
          this[`_${relationshipIdField}`] = newValue
        }
      })
    }
  }

  updateFromObject(attributes) {
    transaction(() => {
      Object.keys(this.field_names).forEach(field => {
        if (attributes[field] !== undefined) {
          this[`_${field}`] = attributes[field]
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
            this[`_${relationshipIdField}`] = this[relationship].map(r => r.id)

          } else {
            this.store._updateResourceFromServer(objectRelationship, pluralizeResource(relationship))
            this[relationship] = this.store[pluralizeResource(relationship)].find(entity => entity.id === objectRelationship.id)
            this[`_${relationshipIdField}`] = this[relationship].id

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
        relationshipRef[`_${addIdToResource(backRef)}`].push(this.id)
      }
    } else {
      relationshipRef[backRef] = this
      relationshipRef[`_${addIdToResource(backRef)}`] = this.id
    }
  }

  addImage(imageUrl) {
    this.images = [{
      image_src: { url: imageUrl},
      name: null,
      id: null
    }].concat(this.images.toJS())
  }

  removeImage(imageUrl) {
    this.images = reject(this.images, image => image.image_src.url === imageUrl)
  }

  setPrimaryImage(imageId) {
    this.images = this.images.map(image => {
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

  asJson(modifiedOnly = true) {
    let json = {}
    Object.keys(Object.assign({}, this.field_names, this.relationships)).forEach(field => {
      if (field === 'costume') {
      }
      if (field in this.relationships) {
        field = addIdToResource(field)
      }
      if (modifiedOnly) {
        if (this[`orig_${field}`] !== undefined && this[`_${field}`] !== this[`orig_${field}`]) {
          json[field] = this[`_${field}`]
        }
      } else {
        json[field] = this[`_${field}`]
      }
    })
    return json
  }

  revert() {
    Object.keys(this.field_names).forEach(field => {
      if (this[`orig_${field}`]) {
        this[`_${field}`] = this[`orig_${field}`]
      }
    })
    this.modified = false
  }

  save() {
    let method = 'POST'
    let apiEndpoint = RESOURCES[this.resource].apiEndpoint

    if (this.id) {
      method = 'PUT'
      apiEndpoint += `/${this.id}`
    }
    let payload = this.asJson(true)
    if (_.isEmpty(payload)) return

    this.store._api(apiEndpoint, method, payload).then(
      response => {
        transaction(() => {
          response[this.resource].forEach(json => {
            this.store._updateResourceFromServer(json, this.resource)
          })
        })
        // Clean up staged resource reference
        const resourceObj = RESOURCES[this.resource]
        this.store[`${resourceObj.singularized}Staged`] = undefined
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
    remove(this.store[this.resource], (n) => n.id === this.id)
  }


}
