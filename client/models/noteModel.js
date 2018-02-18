import React from 'react'
import {computed, extendObservable, observable, transaction} from 'mobx'
import BaseModel from "./baseModel";
import {camelCase, snakeCase, upperFirst} from 'lodash'
import {pluralizeResource, singularizeResource} from "../helpers";
import {Label} from "semantic-ui-react";
import {EditableField} from "../components/EditableField/EditableField";

class Note extends BaseModel {

  @computed get scene() {
    return this.store.scenes.find(scene => {
      if (this.updated_at > scene.updated_at) {
        return this.scene_id === scene.id
      } else {
        return scene.note_ids.includes(this.id)
      }
    })
  }

  @computed get actor() {
    return this.store.actors.find(actor => {
      if (this.updated_at > actor.updated_at) {
        return this.actor_id === actor.id
      } else {
        return actor.note_ids.includes(this.id)
      }
    })
  }

  @computed get assignees() {
    return this.store.roles.filter(role => {
      debugger
      if (this.updated_at > role.updated_at) {
        return this.assignee_ids.includes(role.id)
      } else {
        return role.note_ids.includes(this.id)
      }
    })
  }

  @computed get completed_by() {
    return this.store.roles.find(role => {
      if (this.updated_at > role.updated_at) {
        return this.completed_by_role_id === role.id
      } else {
        return role.completed_note_ids.includes(this.id)
      }
    })
  }

  @computed get noteable() {
    const resource = pluralizeResource(snakeCase(this.noteable_type))
    return this.store[resource].find(res => {
      if (this.updated_at > res.updated_at) {
        return this.noteable_id === res.id
      } else {
        return res.note_ids.includes(this.id)
      }
    })
  }

  @computed get noteableComposite() {
    return `${pluralizeResource(snakeCase(this.viewModel.noteable_type))}.${this.viewModel.noteable_id}`
  }

  set noteableComposite(newValue) {
    const [noteableType, noteableId] = newValue.split('.')
    this.viewModel.noteable_type = upperFirst(camelCase(singularizeResource(noteableType)))
    this.viewModel.noteable_id = parseInt(noteableId)
  }

  constructor(store = null) {
    super(store)
    this.store = store

    super._initializeFields()
  }
}

Note.FIELD_NAMES = {
  id: null,
  category: null,
  department: null,
  noteable_id: null,
  noteable_type: null,
  title: null,
  description: null,
  priority: null,
  status: null,
  actor_id: null,
  scene_id: null,
  completed_by_role_id: null,
  assignee_ids: [],
  updated_at: null
}

Note.RESOURCE = 'notes'

Note.RELATIONSHIPS = {
  scene: 'notes',
  actor: 'notes',
  roles: 'notes',
  costume_items: 'notes',
  costumes: 'notes',
  characters: 'notes'
}

Note.tableColumns = [
  {
    field: 'department',
    header: 'Department'
  },
  {
    field: 'priority',
    header: 'Priority',
    renderCell: note => {
      const dropdownOptions = {
        multiple: false,
        options: ['1', '2', '3'].map(n => {
          return {text: n, value: n}
        })
      }
      return (
        <EditableField
          resource='notes'
          resourceId={note.id}
          field='priority'
          fieldType='dropdown'
          dropdownOptions={dropdownOptions}/>
      )
    },
    cellProps: {singleLine: true}
  },
  {
    field: 'actor_id',
    header: 'Actor',
    renderCell: note => {
      const actor = note.actor
      const actorOptions = note.store.actors.map(actor => actor.dropdownItem())
      return (
        <EditableField
          resource='notes'
          resourceId={note.id}
          field='actor_id'
          fieldType='dropdown'
          dropdownOptions={{options: actorOptions}}
        >
          {actor && actor.label()}
        </EditableField>
      )
    },
    cellProps: {singleLine: true}
  },
  {
    field: 'scene_id',
    header: 'Scene',
    renderCell: note => {
      const scene = note.scene
      const sceneOptions = note.store.scenes.map(scene => scene.dropdownItem())
      return (
        <EditableField
          resource='notes'
          resourceId={note.id}
          field='scene_id'
          fieldType='dropdown'
          dropdownOptions={{options: sceneOptions}}
        >
          {scene && scene.label()}
        </EditableField>
      )
    },
    cellProps: {singleLine: true}
  },
  {
    field: 'noteableComposite',
    header: 'Item',
    renderCell: (note) => {
      const item = note.noteable
      const costumeOptions = note.store.costumes.map(costume => {
        const noteableCompositeKey = `costumes.${costume.id}`
        return costume.dropdownItem({value: noteableCompositeKey, key: noteableCompositeKey})
      })
      const costumeItemOptions = note.store.costume_items.map(costumeItem => {
        const noteableCompositeKey = `costume_items.${costumeItem.id}`
        return costumeItem.dropdownItem({value: noteableCompositeKey, key: noteableCompositeKey})
      })
      const characterOptions = note.store.characters.map(character => {
        const noteableCompositeKey = `characters.${character.id}`
        return character.dropdownItem({value: noteableCompositeKey, key: noteableCompositeKey})
      })
      const dropdownOptions = {
        multiple: false,
        options: costumeItemOptions.concat(costumeOptions, characterOptions)
      }
      return (
        <EditableField
          resource='notes'
          resourceId={note.id}
          field='noteableComposite'
          fieldType='dropdown'
          dropdownOptions={dropdownOptions}
        >
          <Label as='a' image key={item.id}>
            <img src={item.avatar}/>
            {item && (item.title || item.name)}
          </Label>
        </EditableField>
      )
    },
    cellProps: {singleLine: true}
  },
  {
    field: 'title',
    header: 'Title',
    renderCell: note => {
      return (
        <EditableField resource='notes' resourceId={note.id} field='title' />
      )
    }
  },
  {
    field: 'assignee_ids',
    header: 'Assignees',
    renderCell: note => {
      const assignees = note.assignees
      debugger
      const assigneeOptions = note.store.roles.map(role => role.dropdownItem())
      return (
        <EditableField
          resource='notes'
          resourceId={note.id}
          field='assignee_ids'
          fieldType='dropdown'
          dropdownOptions={{options: assigneeOptions, multiple: true}}
        >
          {assignees.map(role => role.label())}
        </EditableField>
      )
    },
    sortKey: 'assignees.length',
    cellProps: {singleLine: true}
  }
]

export default Note

