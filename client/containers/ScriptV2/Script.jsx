import React, {PropTypes} from 'react';
import './Script.scss'
import {Container, Divider, Dropdown, Header, Search, Segment, Visibility} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {action, computed, observable} from "mobx";
import StageAction from "components/StageAction/StageAction";
import {capitalize, compact, replace, uniq} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";

@observer
class Slider extends React.Component {
  @observable sliderValue = null

  render() {
    const {currentStageActionNumber, handleOnMouseUp, maxValue} = this.props;
    return (
      <div className='line-slider-container'>
        <strong>Line No</strong>
        <input
          className='line-slider'
          type='range'
          min={1}
          max={maxValue}
          value={this.sliderValue || currentStageActionNumber || 1}
          onChange={(e) => this.sliderValue = e.target.value}
          onMouseUp={(e) => handleOnMouseUp(parseInt(e.target.value))}
        />
        <span className='line-slider-value'>
          {this.sliderValue || currentStageActionNumber}
        </span>
      </div>
    )
  }
}

@inject("resourceStore", "uiStore") @observer
class SearchScript extends React.Component {
  @observable isLoading = false
  @observable query = ''
  @observable queryResults = []

  handleOnSearchChange(query) {
    const {searchScript} = this.props.resourceStore
    this.query = query
    if (this.query.length >= 2) {
      this.isLoading = true
      searchScript(this.query).then(results => {
        this.queryResults = this.parseResults(results)
        this.isLoading = false
      })
    }
  }

  parseResults(results) {
    return results.stage_actions
  }

  handleOnClick(stageActionNumber) {
    return this.props.handleResultClicked(stageActionNumber)
  }

  resultRenderer(result) {
    return (
      <div className='search-result-container'>
        <div className='result-body' onClick={() => this.handleOnClick(result.number)}>
          <strong>{result.number}: {result.characters.map(character => character.name).join(', ')}</strong> - <span
          className='stage-action'>{this.prettifyStageAction(result.stage_action_type)}</span>
          <Divider fitted/>
          <p className='search-result-description' dangerouslySetInnerHTML={{__html: result.pg_search_highlight}}/>
        </div>
      </div>
    )
  }

  prettifyStageAction(stageActionType) {
    return capitalize(replace(stageActionType, '_', ' '))
  }


  render() {
    return (
      <Search
        className='SearchScript'
        loading={this.isLoading}
        onSearchChange={(e, data) => this.handleOnSearchChange(data.value)}
        results={this.queryResults.toJS()}
        value={this.query}
        minCharacters={2}
        resultRenderer={(result) => this.resultRenderer(result)}
      />
    )
  }
}


@inject("resourceStore", "uiStore") @observer
export class Script extends React.Component {

  @observable loading = true
  @observable loadingMore = false
  @observable editingLineId = null
  @observable showNewLineAbove = null
  @observable enableStickyHeader = false
  @observable sliderValue = null
  @observable currentStageActionNumber = null

  @observable foo = 1


  @computed get stageActions() {
    return this.props.resourceStore.stage_actions.sort((a, b) => a.number - b.number)
  }

  @computed get totalCount() {
    return this.props.resourceStore.stageActionsTotalCount
  }

  @computed get sceneNumbers() {
    // TODO: need to get this from server now
    const sceneNumbers = {}
    let currentSceneId = null
    for (let line of this.stageActions) {
      if (currentSceneId !== line.scene_id) {
        sceneNumbers[line.scene_id] = line.number
        currentSceneId = line.scene_id
      }
    }
    return sceneNumbers
  }

  @computed get canLoadMoreBelow() {
    return this.stageActions[this.stageActions.length - 1].number !== this.totalCount
  }

  @computed get canLoadMoreAbove() {
    return this.stageActions[0].number > 1
  }

  @computed get currentSceneId() {
    const currentStageAction = this.stageActions.find(stageAction => stageAction.number === parseInt(this.currentStageActionNumber))
    return currentStageAction && currentStageAction.scene_id
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadStageActions(null, {start: 0, end: 75}),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => {
      this.loading = false
      this.currentStageActionNumber = this.stageActions.length > 0 && this.stageActions[0].number
    })
  }

  handleScrollToLine(stageActionNumber) {
    this.scrollingToLine = stageActionNumber
    this.handleLoadMoreStageActions(stageActionNumber, true)
    this.sliderValue = null
  }

  @action handleSave(stageActionId) {
    const stageAction = this.props.resourceStore.getStagedResource('stage_actions', stageActionId)
    if (!stageActionId && this.showNewLineAbove) {
      if (this.showNewLineAbove === -1) {
        stageAction.number = this.stageActions.length + 1
      } else {
        stageAction.number = this.showNewLineAbove
      }
    }
    stageAction.save()
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  @action handleCancel(stageActionId) {
    const stageAction = this.props.resourceStore.getStagedResource('stage_actions', stageActionId)
    stageAction.revert()
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  handleAddLine = () => {
    this.showNewLineAbove = -1
    window.scroll({
      left: 0,
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }

  @action handleInsertAbove(stageActionNumber) {
    this.showNewLineAbove = stageActionNumber
  }

  @action handleDelete(stageActionId) {
    const stageAction = this.props.resourceStore.getStagedResource('stage_actions', stageActionId)
    stageAction.destroy()
  }

  generateSceneOptions() {
    const {stage_actions, scenes} = this.props.resourceStore
    const sceneIds = uniq(compact(stage_actions.map(stageAction => stageAction.scene_id)))
    return sceneIds.map(sceneId => {
      const scene = scenes.find(scene => scene.id === sceneId)
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id
      }
    })
  }

  @action handleLoadMoreStageActions(stageActionNumber, fromSlider = false) {
    const start = Math.max(0, stageActionNumber - 37)
    const end = start + 75

    if (fromSlider) {
      this.loading = true
    } else {
      this.loadingMore = true
    }
    this.props.resourceStore.loadStageActions(null, {start, end}).then(() => {
      if (fromSlider) {
        this.loading = false
      } else {
        this.loadingMore = false
      }
      this.currentStageActionNumber = stageActionNumber
      this.scrollingToLine = stageActionNumber
    })
  }

  renderLoadMoreSection(stageActionNumber) {
    return (
      <Visibility
        onOnScreen={() => this.handleLoadMoreStageActions(stageActionNumber)}
        context={this.contextRef}
        once={false}
      >
        <Segment className='load-more-section' loading={this.loadingMore} textAlign='center'>
          Load more!
        </Segment>
      </Visibility>
    )
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    return (
      <div className="Script">
        <Header as="h2" dividing>
          Script
        </Header>
        <div className='script-navbar'>
          <div className='add-line-button'>
            <SearchScript handleResultClicked={(stageActionNumber) => this.handleScrollToLine(stageActionNumber)}/>
          </div>
          <Slider
            currentStageActionNumber={this.currentStageActionNumber}
            maxValue={this.totalCount}
            handleOnMouseUp={(stageActionNumber) => this.handleScrollToLine(stageActionNumber)}
          />
          <div className='scene-selection-container'>
            <strong>
              <Dropdown
                options={this.generateSceneOptions()}
                value={this.currentSceneId}
                onChange={(e, data) => this.handleScrollToLine(this.sceneNumbers[data.value])}
              />
            </strong>
            <div className='current-scene-label'>Current scene</div>
          </div>
        </div>
        <div>
          <Container text className='lines-container'>
            {this.stageActions[0].number > 1 &&
            this.renderLoadMoreSection(this.stageActions[0].number)
            }
            {this.stageActions.map((stageAction, i) => {
              return (
                <div key={`stage-action-${stageAction.number}`}>

                  {this.showNewLineAbove === stageAction.number &&
                  <div className='stage-action-container'>
                    <StageAction
                      stageActionId={null}
                      editMode={true}
                      handleSave={() => this.handleSave(null)}
                      handleCancel={() => this.handleCancel(null)}
                    />
                  </div>
                  }
                  <div
                    className='stage-action-container'
                    ref={(elem => {
                      if (elem && this.scrollingToLine === stageAction.number) {
                        elem.scrollIntoView({block: 'center'})
                        this.scrollingToLine = null
                      }
                    })}
                  >
                    <StageAction
                      stageActionId={stageAction.id}
                      editMode={this.editingLineId === stageAction.id}
                      handleEdit={() => this.editingLineId = stageAction.id}
                      handleSave={() => this.handleSave(stageAction.id)}
                      handleCancel={() => this.handleCancel(stageAction.id)}
                      handleInsertAbove={() => this.handleInsertAbove(stageAction.number)}
                      handleDelete={() => this.handleDelete(stageAction.id)}
                    />
                  </div>
                </div>
              )
            })
            }
            {this.showNewLineAbove === -1 &&
            <div className='stage-action-container'>
              <StageAction
                stageActionId={null}
                editMode={true}
                handleSave={() => this.handleSave(null)}
                handleCancel={() => this.handleCancel(null)}
              />
            </div>
            }
            {(this.showNewLineAbove !== -1 && !this.canLoadMoreBelow) &&
            <Segment className='add-line-text' onClick={() => this.showNewLineAbove = -1}>
              <p>Click to add new line</p>
            </Segment>
            }
            {this.canLoadMoreBelow &&
            this.renderLoadMoreSection(this.stageActions[this.stageActions.length - 1].number)
            }
          </Container>
        </div>
      </div>
    );
  }
}

export default Script;
