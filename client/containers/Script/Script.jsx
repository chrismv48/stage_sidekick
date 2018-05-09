import React, {PropTypes} from 'react';
import './Script.scss'
import {Button, Container, Dropdown, Grid, Header, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import Line from "components/Line/Line";
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
  @observable currentLine = null

  topElement = null
  bottomElement = null

  topLine = null
  bottomLine = null

  @observable knownLineHeights = []

  defaultAvgLineHeight = 96

  @computed get visibleLines() {
    return this.lines.slice(Math.max(0, this.currentLine - 20), this.currentLine + 20)
  }

  @computed get lines() {
    return this.props.resourceStore.lines
  }

  @computed get minLineNo() {
    return this.props.resourceStore.lines.length > 0 ? 1 : null
  }

  @computed get maxLineNo() {
    return this.props.resourceStore.lines.length
  }

  @computed get avgLineHeight() {
    const compactLineHeights = compact(this.knownLineHeights)
    return (Math.floor(compactLineHeights.reduce((a, b) => a + b, 0) / compactLineHeights.length)) || this.defaultAvgLineHeight
  }

  @computed get interpolatedLineHeights() {
    return this.knownLineHeights.map(lineHeight => lineHeight || this.avgLineHeight)
  }

  @computed get sceneNumbers() {
    const sceneNumbers = {}
    let currentSceneId = null
    for (let line of this.lines) {
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
      this.props.resourceStore.loadLines(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => {
      this.loading = false
      this.knownLineHeights = Array(this.lines.length).fill(null)
      this.currentLine = this.lines.length > 0 && this.lines[0].number
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(event) {
    if (this.scrollingToLine) {
      return
    }
    if (this.bottomElement && isElementInViewport(this.bottomElement) && this.visibleLines[this.visibleLines.length - 1].number !== this.lines[this.lines.length - 1].number) {
      this.bottomElement = null
      this.currentLine = this.bottomLine
    } else if (this.topElement && isElementInViewport(this.topElement)) {
      this.topElement = null
      this.currentLine = this.topLine
    }
  }

  handleScrollToLine(lineNumber) {
    this.currentLine = lineNumber
    this.scrollingToLine = lineNumber
  }

  handleSave(lineId) {
    const line = this.props.resourceStore.getStagedResource('lines', lineId)
    if (!lineId && this.showNewLineAbove) {
      if (this.showNewLineAbove === -1) {
        line.number = this.props.resourceStore.lines.length + 1
      } else {
        line.number = this.showNewLineAbove
      }
    }
    line.save()
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  handleCancel(lineId) {
    const line = this.props.resourceStore.getStagedResource('lines', lineId)
    line.revert()
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

  handleInsertAbove(lineNumber) {
    this.showNewLineAbove = lineNumber
  }

  handleDelete(lineId) {
    const line = this.props.resourceStore.getStagedResource('lines', lineId)
    line.destroy()
  }

  generateSceneOptions() {
    const {lines, scenes} = this.props.resourceStore
    const sceneIds = uniq(compact(lines.map(line => line.sceneId)))
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
    const currentLine = this.lines.find(line => line.number === parseInt(this.currentLine))
    return currentLine && currentLine.scene_id
  }

  calculateTopSpacer() {
    const topIndex = this.visibleLines[0].number - 1
    const filteredHeights = this.interpolatedLineHeights.slice(0, topIndex)
    return filteredHeights.reduce((a, b) => a + b, 0)
  }

  calculateBottomSpacer() {
    const bottomIndex = this.visibleLines[this.visibleLines.length - 1].number - 1
    const filteredHeights = this.interpolatedLineHeights.slice(bottomIndex + 1)
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
                  min={this.minLineNo}
                  max={this.maxLineNo}
                  value={this.sliderValue || this.currentLine || 1}
                  onChange={(e) => this.sliderValue = e.target.value}
                  onMouseUp={(e) => this.handleScrollToLine(parseInt(e.target.value))}
                />
                <span className='line-slider-value'>
                {this.sliderValue || this.currentLine}
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
              {this.visibleLines.sort((a, b) => a.number - b.number).map((line, i) => {
                return (
                  <React.Fragment key={line.number}>
                    {this.showNewLineAbove === line.number &&
                    <div>
                      <Line
                        lineId={null}
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
                      this.knownLineHeights[line.number - 1] = elem.offsetHeight

                      if (trackVisibility) {
                        if (i === 0) {
                          this.topElement = elem
                          this.topLine = line.number
                        } else {
                          this.bottomElement = elem
                          this.bottomLine = line.number
                        }
                      }

                      if (this.scrollingToLine === line.number) {
                        elem.scrollIntoView({block: 'center'})
                        this.scrollingToLine = null
                      }
                    })}>
                      <Line
                        lineId={line.id}
                        editMode={this.editingLineId === line.id}
                        handleEdit={() => this.editingLineId = line.id}
                        handleSave={() => this.handleSave(line.id)}
                        handleCancel={() => this.handleCancel(line.id)}
                        handleInsertAbove={() => this.handleInsertAbove(line.number)}
                        handleDelete={() => this.handleDelete(line.id)}
                      />
                    </div>
                  </React.Fragment>
                )
              })
              }
              <div style={{height: this.calculateBottomSpacer()}}/>
              {this.showNewLineAbove === -1 &&
              <Line
                lineId={null}
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
