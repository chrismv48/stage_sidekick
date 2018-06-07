import React, {PropTypes} from 'react';
import './Script.scss'
import {Container, Divider, Dropdown, Header, Search, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {action, computed, observable} from "mobx";
import StageAction from "components/StageAction/StageAction";
import {capitalize, replace, throttle} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";

function isElementInViewport(el) {
  if (!el) {
    return false
  }
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}


@observer
class Slider extends React.Component {
  @observable sliderValue = 1

  render() {
    const {handleOnMouseUp, maxValue} = this.props;
    return (
      <div className='stage-action-slider'>
        <input
          className='line-slider'
          type='range'
          min={1}
          max={maxValue}
          value={this.sliderValue}
          onChange={(e) => this.sliderValue = e.target.value}
          onMouseUp={(e) => handleOnMouseUp(parseInt(e.target.value))}
        />
        <span className='line-slider-value'>
          {this.sliderValue}
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

  topLoaderNode = null
  bottomLoaderNode = null

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
    return this.stageActions.length > 0 && this.stageActions[this.stageActions.length - 1].number < this.totalCount
  }

  @computed get canLoadMoreAbove() {
    return this.stageActions.length > 0 && this.stageActions[0].number > 1
  }

  // returns a map of stageActionNumber to sceneTitle so we know when to render a scene header
  @computed get sceneChanges() {
    const stageActionsToScene = {}
    this.stageActions.forEach((stageAction, i) => {
      const prevSceneId = this.stageActions[i - 1] ? this.stageActions[i - 1].sceneId : null
      if (prevSceneId !== stageAction.sceneId) {
        stageActionsToScene[stageAction.number] = stageAction.scene.title
      }
    })
    return stageActionsToScene
  }

  componentDidMount() {

    window.addEventListener('scroll', throttle(this.handleOnScroll.bind(this), 50));

    this.loading = true
    Promise.all([
      this.props.resourceStore.loadStageActions(null, this.getRangeForStageActionNumber(0)),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => {
      this.loading = false
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll.bind(this));
  }

  handleOnScroll(event) {
    if (this.loading || this.loadingMore) {
      return
    }
    if (isElementInViewport(this.topLoaderNode)) {
      this.handleLoadMoreStageActions(this.stageActions[0].number)
    } else if (isElementInViewport(this.bottomLoaderNode)) {
      this.handleLoadMoreStageActions(this.stageActions[this.stageActions.length - 1].number)
    }
  }

  handleScrollToLine(stageActionNumber) {
    this.scrollingToLine = stageActionNumber
    this.handleLoadMoreStageActions(stageActionNumber, true)
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
    const stageActionQueryRange = this.getRangeForStageActionNumber(stageAction.number)
    stageAction.save(stageActionQueryRange)
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  @action handleCancel(stageActionId) {
    const stageAction = this.props.resourceStore.getStagedResource('stage_actions', stageActionId)
    stageAction.revert()
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  @action handleInsertAbove(stageActionNumber) {
    this.showNewLineAbove = stageActionNumber
  }

  @action handleDelete(stageActionId) {
    const stageAction = this.props.resourceStore.getStagedResource('stage_actions', stageActionId)
    const stageActionQueryRange = this.getRangeForStageActionNumber(stageAction.number)
    stageAction.destroy(stageActionQueryRange)
  }

  generateSceneOptions() {
    const {scenes, scenesWithStageAction} = this.props.resourceStore
    return scenesWithStageAction.map(([sceneId, _]) => {
      const scene = scenes.find(scene => scene.id === sceneId)
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id
      }
    })
  }

  getRangeForStageActionNumber(stageActionNumber) {
    const start = Math.max(0, stageActionNumber - 37)
    const end = start + 75
    return {start, end}
  }

  handleLoadMoreStageActions(stageActionNumber, fromSlider = false) {
    const start = Math.max(0, stageActionNumber - 37)
    const end = start + 75

    const stageActionQueryRange = this.getRangeForStageActionNumber(stageActionNumber)

    if (fromSlider) {
      this.loading = true
    } else {
      this.loadingMore = true
    }
    this.props.resourceStore.loadStageActions(null, stageActionQueryRange).then(action("loadingStageActions", _ => {
      if (fromSlider) {
        this.loading = false
      } else {
        this.loadingMore = false
      }
      this.scrollingToLine = stageActionNumber
      this.topLoaderNode = null
      this.bottomLoaderNode = null
    }))
  }

  renderLoadMoreSection(stageActionNumber, location) {
    return (
      <Segment loading={this.loadingMore} textAlign='center'>
        <div
          ref={elem => {
            if (elem) {
              if (location === 'top') {
                this.topLoaderNode = elem
              }
              else {
                this.bottomLoaderNode = elem
              }
            }
          }
          }
      >
          Load more!
        </div>
      </Segment>
    )
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    const {scenesWithStageAction} = this.props.resourceStore
    return (
      <div className="Script">
        <Header as="h2" dividing>
          Script
        </Header>
        <div className='script-navbar'>
          <div className='script-search'>
            <SearchScript handleResultClicked={(stageActionNumber) => this.handleScrollToLine(stageActionNumber)}/>
          </div>
          <div className='script-navigation'>
            <div className='line-slider-container'>
              <Dropdown text='Stage Action No'>
                <Dropdown.Menu>
                  <Slider
                    maxValue={this.totalCount}
                    handleOnMouseUp={(stageActionNumber) => this.handleScrollToLine(stageActionNumber)}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className='scene-selection-container'>
              <Dropdown
                text='Scene'
                options={this.generateSceneOptions()}
                onChange={(e, data) => this.handleScrollToLine(scenesWithStageAction.find(n => n[0] === data.value)[1])}
                selectOnBlur={false}
              />
            </div>
          </div>
        </div>

        <div>
          <Container text className='lines-container'>
            {this.canLoadMoreAbove &&
            this.renderLoadMoreSection(this.stageActions[0].number, 'top')
            }
            {this.stageActions.map((stageAction, i) => {
              return (
                <div key={`stage-action-${stageAction.number}`}>
                  {this.sceneChanges[stageAction.number] && <h1>{stageAction.scene.title}</h1>}
                  <div>
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
            this.renderLoadMoreSection(this.stageActions[this.stageActions.length - 1].number, 'bottom')
            }
          </Container>
        </div>
      </div>
    );
  }
}

export default Script;
