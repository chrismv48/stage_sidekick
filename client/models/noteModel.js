import React from 'react'
import {computed, extendObservable, observable, transaction} from 'mobx'
import BaseModel from "./baseModel";
import {camelCase, snakeCase, upperFirst} from 'lodash'
import {pluralizeResource, singularizeResource} from "../helpers";
import {Icon, Label} from "semantic-ui-react";

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
      if (this.updated_at > role.updated_at) {
        return this.assignee_ids.includes(role.id)
      } else {
        return role.assigned_note_ids.includes(this.id)
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

  @computed get tableData() {
    return [
      {
        field: 'status',
        header: 'Status',
        filterOptions: {
          field: 'status',
          compact: true,
          multiple: true,
          options: Note.statusesDropdownOptions,
          defaultValue: ['Assigned', 'In Progress']
        },
        renderCell: (() => {
          switch (this.status) {
            case "Assigned":
              return <Icon size='large' name='inbox' color='purple' title='Assigned'/>

            case "In Progress":
              return <Icon size='large' name='wait' color='blue' title='In Progress'/>
            case "Complete":
              return <Icon size='large' name='check circle' color='green' title='Completed'/>
            default:
              return 'Assigned'
          }
        })(),
        cellProps: {singleLine: true, textAlign: 'center'},
      },
      {
        field: 'priority',
        header: 'Priority',
        filterOptions: {
          multiple: true,
          field: 'priority',
          compact: true,
          options: Note.prioritiesDropdownOptions
        },
        cellProps: {textAlign: 'center'}
      },
      {
        field: 'department',
        header: 'Department',
        filterOptions: {
          multiple: true,
          field: 'department',
          compact: true,
          options: this.store.resources['roles'].departmentDropdownOptions
        }
      },
      {
        field: 'title',
        header: 'Note',
        cellProps: {width: 6}
      },
      {
        field: 'actor_id',
        header: 'Actor',
        renderCell:
        this.actor &&
        <a
          style={{cursor: 'pointer'}}
          onClick={() => this.store.rootStore.uiStore.showResourceSidebar(this.actor.id, this.actor.resource)}
        >
          {this.actor.fullName}
        </a>,
        filterOptions: {
          multiple: true,
          field: 'actor_id',
          options: this.store.dropdownOptions('actors')
        }
      },
      {
        field: 'scene_id',
        header: 'Scene',
        renderCell:
        this.scene &&
        <a
          style={{cursor: 'pointer'}}
          onClick={() => this.store.rootStore.uiStore.showResourceSidebar(this.scene.id, this.scene.resource)}
        >
          {this.scene.title}
        </a>,
        filterOptions: {
          multiple: true,
          field: 'scene_id',
          options: this.store.dropdownOptions('scenes')
        },
        cellProps: {width: 2}
      },
      {
        field: 'noteableComposite',
        header: 'Item',
        renderCell:
            <Label as='a' image key={this.noteable.id}>
              <img src={this.noteable.avatar}/>
              {this.noteable && (this.noteable.title || this.noteable.name)}
            </Label>,
        filterOptions: {
          options: this.noteableDropdownOptions
        },
        cellProps: {singleLine: true}
      },
      {
        field: 'assignee_ids',
        header: 'Assignees',
        renderCell:
          this.assignees.map(role => <div style={{whiteSpace: 'nowrap', marginBottom: '5px'}}>
            <a
              style={{cursor: 'pointer'}}
              onClick={() => this.store.rootStore.uiStore.showResourceSidebar(role.id, role.resource)}
            >
              {role.fullName}
            </a>
          </div>),
        sortKey: 'assignees.length',
        filterOptions: {
          multiple: true,
          field: 'assignee_ids',
          options: this.store.roles.map(role => {
            return {text: role.fullName, value: role.id}
          })
        }
      }
    ]
  }

  @computed get formFields() {
    return [
      {
        field: 'status',
        inputType: 'dropdown',
        inputOptions: {options: Note.statusesDropdownOptions},
      },
      {
        field: 'priority',
        inputType: 'dropdown',
        inputOptions: {options: Note.prioritiesDropdownOptions},
      },
      {
        field: 'department',
        inputType: 'dropdown',
        inputOptions: {options: this.store.resources['roles'].departmentDropdownOptions},
      },
      {
        field: 'noteableComposite',
        label: 'Refers to',
        inputType: 'dropdown',
        inputOptions: {options: this.noteableDropdownOptions},
      },
      {
        field: 'scene_id',
        label: 'Scene',
        inputType: 'dropdown',
        inputOptions: {options: this.store.dropdownOptions('scenes')},
      },
      {
        field: 'actor_id',
        label: 'Actor',
        inputType: 'dropdown',
        inputOptions: {options: this.store.dropdownOptions('actors')},
        defaultVisible: false
      },
      {
        field: 'assignee_ids',
        label: 'Assignee(s)',
        inputType: 'dropdown',
        inputOptions: {multiple: true, options: this.store.dropdownOptions('roles')},
      },
      {
        field: 'title',
        label: 'Note',
        inputType: 'textarea',
        required: true,
        formFieldOptions: {required: true}
      }
    ]
  }

  @computed get noteableDropdownOptions() {
    const costumeOptions = this.store.costumes.map(costume => {
      const noteableCompositeKey = `costumes.${costume.id}`
      return costume.dropdownItem({value: noteableCompositeKey, key: noteableCompositeKey})
    })
    const costumeItemOptions = this.store.costume_items.map(costumeItem => {
      const noteableCompositeKey = `costume_items.${costumeItem.id}`
      return costumeItem.dropdownItem({value: noteableCompositeKey, key: noteableCompositeKey})
    })
    const characterOptions = this.store.characters.map(character => {
      const noteableCompositeKey = `characters.${character.id}`
      return character.dropdownItem({value: noteableCompositeKey, key: noteableCompositeKey})
    })
    return costumeItemOptions.concat(costumeOptions, characterOptions)
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
  roles: 'assigned_notes',
  costume_items: 'notes',
  costumes: 'notes',
  characters: 'notes'
}

Note.PRIORITIES = ['1', '2', '3']
Note.prioritiesDropdownOptions = Note.PRIORITIES.map(n => {
  return {text: n, value: n}
})

Note.STATUSES = ['Assigned', 'In Progress', 'Completed']

Note.statusesDropdownOptions = Note.STATUSES.map(n => {
  return {text: n, value: n}
})

Note.API_ENDPOINT = 'notes'


export default Note
