import React from 'react';
import './DressingList.scss'
import {Accordion, Form, Grid, Icon, Segment} from 'semantic-ui-react'
import 'react-table/react-table.css'
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import ContentLoader from "components/ContentLoader/ContentLoader";
import {sortBy} from 'lodash'

@inject("resourceStore", "uiStore") @observer
export class DressingList extends React.Component {

  @observable loading = true
  @observable editorExpanded = false

  @computed get costumeCharactersScenes() {
    const {costumes, getStagedResource} = this.props.resourceStore
    let costume_characters_scenes = []
    for (let costume of costumes) {
      costume_characters_scenes.push(...costume.costumes_characters_scenes)
    }
    return sortBy(costume_characters_scenes, 'order_index')
  }

  handleChange = (costumeCharacterScene, field, value) => {
    // we have to go through all this hub bub because the isDirty method on viewModel only does a shallow comparison so we when
    // we change a nested attribute, it doesn't think anything changed
    const {getStagedResource} = this.props.resourceStore
    const costumeStaged = getStagedResource('costumes', costumeCharacterScene.costume_id)
    const costumes_characters_scenes = [...costumeStaged.costumes_characters_scenes]
    const ccs = costumes_characters_scenes.find(ccs => ccs.id === costumeCharacterScene.id)
    ccs[field] = value
    costumeStaged.costumes_characters_scenes = costumes_characters_scenes
    costumeStaged.save()
  }

  generateDiff(prev_ccs, current_ccs) {
    const {costumes, scenes, characters} = this.props.resourceStore
    const prevCostume = costumes.find(costume => costume.id === prev_ccs.costume_id) || {}
    const prevCostumeItems = prevCostume.costume_items || []
    const currentCostume = costumes.find(costume => costume.id === current_ccs.costume_id)
    const currentCostumeItems = currentCostume.costume_items
    const diff = {additions: [], removals: [], repeats: []}

    for (let costumeItem of prevCostumeItems) {
      // repeats
      if (currentCostumeItems.includes(costumeItem)) {
        diff.repeats.push(costumeItem)
        // removals
      } else {
        diff.removals.push(costumeItem)
      }
    }

    for (let costumeItem of currentCostumeItems) {
      if (!prevCostumeItems.includes(costumeItem)) {
        diff.additions.push(costumeItem)
      }
    }
    const scene = scenes.find(scene => scene.id === current_ccs.scene_id)
    const character = characters.find(character => character.id === current_ccs.character_id)
    return (
      <div key={current_ccs.id}>
        <h4>{scene.title}</h4>
        <div className='diff-container'>
          <div className='diff-item'>
            <h5>Removals</h5>
            {diff.removals.map(removal => {
              return (
                <ul className="dress-list-item" key={removal.id}>
                  <li>
                    <a
                      style={{cursor: 'pointer'}}
                      onClick={() => this.store.rootStore.uiStore.showResourceSidebar(removal.id, removal.resource)}
                    >
                      {removal.title}
                    </a>
                  </li>
                </ul>
              )
            })
            }
          </div>
          <div className='diff-item'>
            <h5>Additions</h5>
            {diff.additions.map(addition => {
              return (
                <ul className="dress-list-item" key={addition.id}>
                  <li>
                    <a
                      style={{cursor: 'pointer'}}
                      onClick={() => this.store.rootStore.uiStore.showResourceSidebar(addition.id, addition.resource)}
                    >
                      {addition.title}
                    </a>
                  </li>
                </ul>
              )
            })
            }
          </div>
          <div className='diff-item'>
            <h5>Repeats</h5>
            {diff.repeats.map(repeat => {
              return (
                <ul className="dress-list-item" key={repeat.id}>
                  <li>
                    <a
                      style={{cursor: 'pointer'}}
                      onClick={() => this.store.rootStore.uiStore.showResourceSidebar(repeat.id, repeat.resource)}
                    >
                      {repeat.title}
                    </a>
                  </li>
                </ul>
              )
            })
            }
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCostumes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadActors(),
      this.props.resourceStore.loadCostumeItems(),
    ]).then(() => this.loading = false)
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    const {costumes, scenes, characters} = this.props.resourceStore
    return (
      <Grid className='DressingList'>
        <Grid.Column>
          <Accordion exclusive={false}>
            <Accordion.Title as='h4' active={this.editorExpanded} index={0}
                             onClick={() => this.editorExpanded = !this.editorExpanded}>
              <Icon name='dropdown'/>
              {this.editorExpanded ? 'Hide' : 'Show'} Editor
            </Accordion.Title>
            <Accordion.Content active={this.editorExpanded}>
              <div style={{padding: 20}}>
                {this.costumeCharactersScenes.map(ccs => {
                  const costume = costumes.find(costume => costume.id === ccs.costume_id)

                  const scene = scenes.find(scene => scene.id === ccs.scene_id) || {}
                  const character = characters.find(character => character.id === ccs.character_id)

                  return (
                    <Form key={ccs.id}>
                      <Form.Group widths='equal'>
                        <Form.Select
                          label='Scene'
                          options={scenes.map(scene => scene.dropdownItem({image: null}))}
                          value={scene.id}
                          onChange={(event, data) => this.handleChange(ccs, 'scene_id', data.value)}
                          placeholder='Scene'/>

                        <Form.Select
                          label='Character'
                          options={characters.map(character => character.dropdownItem({image: null}))}
                          value={character.id}
                          onChange={(event, data) => ccs.character_id = data.value}
                          placeholder='Character'/>

                        <Form.Select
                          label='Costume'
                          options={costumes.map(costume => costume.dropdownItem({image: null}))}
                          value={costume.id}
                          onChange={(event, data) => ccs.costume_id = data.value}
                          placeholder='Costume'/>
                      </Form.Group>
                    </Form>
                  )
                })}
              </div>
            </Accordion.Content>
          </Accordion>
          <div>
            {characters.map(character => {
              const costumes_characters_scenes = sortBy(character.costumes_characters_scenes, 'order_index')
              if (costumes_characters_scenes.length === 0) {
                return
              }
              return (
                <Segment>
                  <h3>{character.name}</h3>
                  {costumes_characters_scenes.map((ccs, i) => {
                    let prev_ccs
                    if (i === 0) {
                      prev_ccs = {}
                    } else {
                      prev_ccs = costumes_characters_scenes[i - 1]
                    }
                    if (prev_ccs.costume_id !== ccs.costume_id) {
                      return this.generateDiff(prev_ccs, ccs)
                    }
                  })}
                </Segment>
              )
            })}
          </div>
        </Grid.Column>
      </Grid>
    )
  }
}

export default DressingList;
