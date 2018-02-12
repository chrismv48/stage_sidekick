import React from 'react'
import {computed} from 'mobx'
import {BaseModel} from "./baseModel";
import {Header, Icon, Image, Label} from "semantic-ui-react";

const sourceOptions = [
  'Stock',
  'Internet',
  'Rental'
]

class CostumeItem extends BaseModel {


  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
    super._initializeRelationships()
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
  notes: null,
  images: []
}

CostumeItem.RELATIONSHIPS = {
  costume: 'costume_items',
}

CostumeItem.RESOURCE = 'costume_items'

CostumeItem.tableColumns = [
  {
    field: 'title',
    header: 'Title',
    renderCell: (costumeItem) => {
      return (
        <Header as='h5'>
          <Image avatar src={costumeItem.avatar}/>
          {' '}{costumeItem.title}
        </Header>
      )
    },
  },
  {
    field: 'costume',
    header: 'Costume',
    renderCell: (costumeItem) => {
      const costume = costumeItem.costume
      return (
        <Label image key={costume.id}>
          <Image avatar src={costume.avatar}/>
          {costume.title}
          <Icon name='delete'/>
        </Label>
      )
    },
    filterOptions: {
      multiple: false,
      field: 'costume_id',
      options: (store) => {
        return store.costumes.map(costume => {
          return {text: costume.title, value: costume.id}
        })
      }
    }
  },
  {
    field: 'description',
    header: 'Description'
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
      options: (store) => {
        return sourceOptions.map(source => {
          return {text: source, value: source}
        })
      }
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

export default CostumeItem
