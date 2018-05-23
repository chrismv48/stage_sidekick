import React, {PropTypes} from 'react';
import './Script.scss'
import {Button, Container, Dropdown, Grid, Header, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import StageAction from "components/StageAction/StageAction";
import {compact, uniq} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";

function isElementInViewport(el) {

  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

@inject("resourceStore", "uiStore") @observer
export class Script extends React.Component {

  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
  }

  @observable loading = true
  @observable editingLineId = null
  @observable showNewLineAbove = null
  @observable enableStickyHeader = false
  @observable sliderValue = null
  @observable currentStageAction = null

  topElement = null
  bottomElement = null

  topLine = null
  bottomLine = null

  @observable knownLineHeights = []

  defaultAvgLineHeight = 96

  @computed get visibleStageActions() {
    return this.stageActions.slice(Math.max(0, this.currentStageAction - 20), this.currentStageAction + 20)
  }

  @computed get stageActions() {
    return this.props.resourceStore.stage_actions
  }

  @computed get minStageActionNo() {
    return this.stageActions.length > 0 ? 1 : null
  }

  @computed get maxStageActionNo() {
    return this.stageActions.length
  }

  @computed get avgStageActionHeight() {
    const compactLineHeights = compact(this.knownLineHeights)
    return (Math.floor(compactLineHeights.reduce((a, b) => a + b, 0) / compactLineHeights.length)) || this.defaultAvgLineHeight
  }

  @computed get interpolatedStageActionHeights() {
    return this.knownLineHeights.map(stageActionHeight => stageActionHeight || this.avgStageActionHeight)
  }

  @computed get sceneNumbers() {
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

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadStageActions(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => {
      this.loading = false
      this.knownLineHeights = Array(this.stageActions.length).fill(null)
      this.currentStageAction = this.stageActions.length > 0 && this.stageActions[0].number
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(event) {
    if (this.scrollingToLine) {
      return
    }
    if (this.bottomElement && isElementInViewport(this.bottomElement) && this.visibleStageActions[this.visibleStageActions.length - 1].number !== this.stageActions[this.stageActions.length - 1].number) {
      this.bottomElement = null
      this.currentStageAction = this.bottomLine
    } else if (this.topElement && isElementInViewport(this.topElement)) {
      this.topElement = null
      this.currentStageAction = this.topLine
    }
  }

  handleScrollToLine(stageActionNumber) {
    this.currentStageAction = stageActionNumber
    this.scrollingToLine = stageActionNumber
  }

  handleSave(stageActionId) {
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

  handleCancel(stageActionId) {
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

  handleInsertAbove(stageActionNumber) {
    this.showNewLineAbove = stageActionNumber
  }

  handleDelete(stageActionId) {
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

  getCurrentSceneId() {
    debugger
    const currentStageAction = this.stageActions.find(stageAction => stageAction.number === parseInt(this.currentStageAction))
    return currentStageAction && currentStageAction.scene_id
  }

  calculateTopSpacer() {
    const topIndex = this.visibleStageActions[0].number - 1
    const filteredHeights = this.interpolatedStageActionHeights.slice(0, topIndex)
    return filteredHeights.reduce((a, b) => a + b, 0)
  }

  calculateBottomSpacer() {
    const bottomIndex = this.visibleStageActions[this.visibleStageActions.length - 1].number - 1
    const filteredHeights = this.interpolatedStageActionHeights.slice(bottomIndex + 1)
    return filteredHeights.reduce((a, b) => a + b, 0)
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    return (
      <Grid className="Script">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Script
            </Header>
            <div className='script-navbar'>
              <div className='add-line-button'>
                <Button primary icon='plus' onClick={this.handleAddLine} content='Add line'/>
              </div>
              <div className='line-slider-container'>
                <strong>Line No</strong>
                <input
                  className='line-slider'
                  type='range'
                  min={this.minStageActionNo}
                  max={this.maxStageActionNo}
                  value={this.sliderValue || this.currentStageAction || 1}
                  onChange={(e) => this.sliderValue = e.target.value}
                  onMouseUp={(e) => this.handleScrollToLine(parseInt(e.target.value))}
                />
                <span className='line-slider-value'>
                {this.sliderValue || this.currentStageAction}
              </span>
              </div>
              <div className='scene-selection-container'>
                <strong>
                  <Dropdown
                    options={this.generateSceneOptions()}
                    value={this.getCurrentSceneId()}
                    onChange={(e, data) => this.handleScrollToLine(this.sceneNumbers[data.value])}
                  />
                </strong>
                <div className='current-scene-label'>Current scene</div>
              </div>
            </div>
            <Container text className='lines-container'>
              <div style={{height: this.calculateTopSpacer()}}/>
              {this.visibleStageActions.sort((a, b) => a.number - b.number).map((stageAction, i) => {
                const trackVisibility = (i === 0 && stageAction.number > 1) || (i === this.visibleStageActions.length - 3)
                return (
                  <React.Fragment key={stageAction.number}>
                    {this.showNewLineAbove === stageAction.number &&
                    <div>
                      <StageAction
                        stageActionId={null}
                        editMode={true}
                        handleSave={() => this.handleSave(null)}
                        handleCancel={() => this.handleCancel(null)}
                      />
                    </div>
                    }
                    <div ref={(elem => {
                      if (!elem) {
                        return
                      }
                      this.knownLineHeights[stageAction.number - 1] = elem.offsetHeight

                      if (trackVisibility) {
                        if (i === 0) {
                          this.topElement = elem
                          this.topLine = stageAction.number
                        } else {
                          this.bottomElement = elem
                          this.bottomLine = stageAction.number
                        }
                      }

                      if (this.scrollingToLine === stageAction.number) {
                        elem.scrollIntoView({block: 'center'})
                        this.scrollingToLine = null
                      }
                    })}>
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
                  </React.Fragment>
                )
              })
              }
              <div style={{height: this.calculateBottomSpacer()}}/>
              {this.showNewLineAbove === -1 &&
              <StageAction
                stageActionId={null}
                editMode={true}
                handleSave={() => this.handleSave(null)}
                handleCancel={() => this.handleCancel(null)}
              />
              }
              {this.showNewLineAbove !== -1 &&
              <Segment className='add-line-text' onClick={() => this.showNewLineAbove = -1}>
                <p>Click to add new line</p>
              </Segment>
              }
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Script;
