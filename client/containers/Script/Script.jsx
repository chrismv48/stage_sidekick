import React, {PropTypes} from 'react';
import './Script.scss'
import {Container, Divider, Dropdown, Search, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {action, computed, observable} from "mobx";
import StageAction from "components/StageAction/StageAction";
import {capitalize, groupBy, replace, sortBy, throttle} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";
import StageActionSpan from "../../components/StageActionSpan/StageActionSpan";
import StageActionSpanForm from "../../components/StageActionSpan/StageActionSpanForm";

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
  @observable insertingSpanForNumber = null
  @observable editingSpanId = null

  topLoaderNode = null
  bottomLoaderNode = null

  get fromCrossPlot() {
    return this.props.location.state && this.props.location.state.fromCrossPlot
  }

  @computed get stageActions() {
    return this.props.resourceStore.stage_actions.sort((a, b) => a.number - b.number)
  }

  @computed get stageActionSpans() {
    return this.props.resourceStore.stage_action_spans
  }

  @computed get stageActionSpanStaged() {
    return this.props.resourceStore.getStagedResource('stage_action_spans', this.editingSpanId)
  }

  @computed get totalCount() {
    return this.props.resourceStore.stageActionsTotalCount
  }

  @computed get canLoadMoreBelow() {
    return this.stageActions.length > 0 && this.stageActions[this.stageActions.length - 1].number < this.totalCount
  }

  @computed get canLoadMoreAbove() {
    return this.stageActions.length > 0 && this.stageActions[0].number > 1
  }

  @computed get spansByStartNumber() {
    return groupBy(this.stageActionSpans, span => span.span_start)
  }

  @computed get spansByEndNumber() {
    return groupBy(this.stageActionSpans, span => span.span_end)
  }

  @computed get sceneToStartNumber() {
    const sceneToStartNumber = {}
    for (let span of this.stageActionSpans.filter(span => span.isScene())) {
      sceneToStartNumber[span.spannable_id] = span.span_start
    }
    return sceneToStartNumber
  }

  componentDidMount() {

    window.addEventListener('scroll', throttle(this.handleOnScroll.bind(this), 50));

    this.loading = true
    Promise.all([
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadStageActionSpans(),
      this.props.resourceStore.loadStageActions(null, this.getRangeForStageActionNumber(0))
    ]).then(() => {
      this.loading = false
      if (this.props.location.state) {
        this.editingSpanId = this.props.location.state.editingSpanId
      }
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

  @action handleInsertSpan(stageActionNumber) {
    this.insertingSpanForNumber = stageActionNumber
  }

  @action handleDelete(stageActionId) {
    const stageAction = this.props.resourceStore.getStagedResource('stage_actions', stageActionId)
    const stageActionQueryRange = this.getRangeForStageActionNumber(stageAction.number)
    stageAction.destroy(stageActionQueryRange)
  }

  getRangeForStageActionNumber(stageActionNumber) {
    const start = Math.max(0, stageActionNumber - 37)
    const end = start + 75
    return {start, end}
  }

  handleLoadMoreStageActions(stageActionNumber, fromSlider = false) {
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

  renderSpanBar() {
    if (this.insertingSpanForNumber) {
      this.stageActionSpanStaged.span_start = this.insertingSpanForNumber
    }
    return (
      <div className='span-bar'>
        <div className='stage-action-span-label'>{this.editingSpanId ? 'Editing' : 'Creating'} Stage Action Span</div>
        <StageActionSpanForm
          spanId={this.stageActionSpanStaged.id}
          handleSave={e => this.handleSaveSpan(e)}
          handleCancel={e => this.handleCancelSpan(e)}
          handleSearchLineNumber={lineNumber => this.handleScrollToLine(lineNumber)}
        />
      </div>
    )
  }

  shouldRenderSpanBar() {
    return this.insertingSpanForNumber || this.editingSpanId
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

  shouldRenderSpan(span, isStart) {
    return !(span.spannable_type === 'Scene' && !isStart)
  }

  renderSpans(spans, isStart) {
    const sortedSpans = sortBy(spans, span => span.isScene() ? 0 : 1)  // Make sure scenes are rendered first
    return sortedSpans.filter(span => this.shouldRenderSpan(span, isStart)).map(span => {
      return (
        <StageActionSpan
          key={`span-${span.id}`}
          spanId={span.id}
          handleJumpToLine={(number) => this.handleScrollToLine(number)}
          isStart={isStart}
          handleEdit={() => this.editingSpanId = span.id}
          handleDelete={() => span.destroy()}
        />
      )
    })
  }

  handleSaveSpan(e) {
    e.preventDefault()
    this.stageActionSpanStaged.save()
    this.insertingSpanForNumber = null
    this.editingSpanId = null
    if (this.fromCrossPlot) {
      this.props.history.push('/cross-plot')
    }
  }

  handleCancelSpan(e) {
    e.preventDefault()
    this.stageActionSpanStaged.revert()
    this.insertingSpanForNumber = null
    this.editingSpanId = null
    if (this.fromCrossPlot) {
      this.props.history.push('/cross-plot')
    }
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    return (
      <div className="Script">
        <div className='header-bar'>
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
                options={this.props.resourceStore.dropdownOptions('scenes')}
                onChange={(e, data) => this.handleScrollToLine(this.sceneToStartNumber[data.value])}
                selectOnBlur={false}
              />
            </div>
          </div>
        </div>
          {this.shouldRenderSpanBar() &&
          this.renderSpanBar()
          }
        </div>

        <div className='main-body'>
          <Container text className='lines-container'>
            {this.canLoadMoreAbove &&
            this.renderLoadMoreSection(this.stageActions[0].number, 'top')
            }
            {this.stageActions.map((stageAction, i) => {
              const spanStarts = this.spansByStartNumber[stageAction.number] || []
              const spanEnds = this.spansByEndNumber[stageAction.number] || []
              return (
                <div key={`stage-action-${stageAction.number}`}>

                  {this.renderSpans(spanStarts, true)}
                  {this.renderSpans(spanEnds, false)}

                  <div>
                    {this.showNewLineAbove === stageAction.number &&
                    <div className='stage-action-container'>
                      <StageAction
                        stageActionId={null}
                        sceneId={stageAction.scene.id}
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
                        sceneId={stageAction.scene.id}
                        editMode={this.editingLineId === stageAction.id}
                        handleEdit={() => this.editingLineId = stageAction.id}
                        handleSave={() => this.handleSave(stageAction.id)}
                        handleCancel={() => this.handleCancel(stageAction.id)}
                        handleInsertAbove={() => this.handleInsertAbove(stageAction.number)}
                        handleInsertSpan={() => this.handleInsertSpan(stageAction.number)}
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
