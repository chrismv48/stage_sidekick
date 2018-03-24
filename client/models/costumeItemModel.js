import React from 'react'
import {computed} from 'mobx'
import BaseModel from "./baseModel";
import {Image, Label} from "semantic-ui-react";
import CostumeItemFragment from "components/Fragment/CostumeItemFragment";
import {Link} from "react-router-dom";


class CostumeItem extends BaseModel {

  @computed get formFields() {
    return [
      {
        inputType: 'image_upload',
      },
      {
        field: 'title',
        inputType: 'text',
        formFieldOptions: {required: true}
      },
      {
        field: 'description',
        inputType: 'textarea',
      },
      {
        field: 'item_type',
        label: 'Type',
        inputType: 'dropdown',
        inputOptions: {options: CostumeItem.itemTypeDropdownOptions},
      },
      {
        field: 'costume_id',
        label: 'Costume',
        inputType: 'dropdown',
        inputOptions: {options: this.store.dropdownOptions('costumes')}
      },
      {
        field: 'care_instructions',
        inputType: 'text',
      },
      {
        field: 'source',
        inputType: 'text',
      },
      {
        field: 'brand',
        inputType: 'text',
      },
      {
        field: 'notes',
        inputType: 'text',
      },
      {
        field: 'cost',
        inputType: 'text',
      },
    ]

  }

  @computed get tableData() {
    return [
      {
        field: 'title',
        header: 'Title',
        renderCell: <CostumeItemFragment costumeItem={this}/>
      },
      {
        field: 'costume',
        header: 'Costume',
        renderCell:
          <Label as={Link} to={this.costume.href} image key={this.costume.id}>
            <Image avatar src={this.costume.avatar}/>
            {this.costume.title}
          </Label>,
        cellOptions: {singleLine: true},
        filterOptions: {
          multiple: false,
          field: 'costume_id',
          options: this.store.dropdownOptions('costumes')
        }
      },
      {
        field: 'description',
        header: 'Description',
        defaultVisible: false
      },
      {
        field: 'item_type',
        header: 'Item Type'
      },
      {
        field: 'care_instructions',
        header: 'Care Instructions'
      },
      {
        field: 'source',
        header: 'Source',
        filterOptions: {
          multiple: true,
          options: CostumeItem.sourceDropdownOptions
        }
      },
      {
        field: 'brand',
        header: 'Brand'
      },
      {
        field: 'cost',
        header: 'Cost'
      },
      {
        field: 'notes',
        header: 'Notes'
      }
    ]

  }

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
  }

  dropdownItem(options) {
    return (
      {
        image: {src: this.avatar, circular: true},
        text: this.title,
        value: this.id,
        key: this.id,
        ...options
      }
    )
  }

}

CostumeItem.FIELD_NAMES = {
  id: null,
  title: null,
  description: null,
  display_image: null,
  item_type: null,
  care_instructions: null,
  source: null,
  brand: null,
  cost: null,
  images: [],
  comments: [],
  updated_at: null,
  costume_id: null,
  note_ids: []
}

CostumeItem.RELATIONSHIPS = {
  'costume': 'costume_items'
}

CostumeItem.RESOURCE = 'costume_items'

CostumeItem.SOURCE_OPTIONS = [
  'Stock',
  'Internet',
  'Rental'
]

CostumeItem.sourceDropdownOptions = CostumeItem.SOURCE_OPTIONS.map(n => {
  return {text: n, value: n}
})

CostumeItem.itemTypes = [
  'Shirt',
  'Pants',
  'Jacket',
  'Shoes',
  'Hat',
  'Belt',
  'Dress'
]

CostumeItem.itemTypeDropdownOptions = CostumeItem.itemTypes.map(n => {
  return {text: n, value: n}
})

CostumeItem.API_ENDPOINT = 'costume_items'


export default CostumeItem
