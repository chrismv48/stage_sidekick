import React, {PropTypes} from 'react';
import './Script.scss'
import {Button, Container, Dropdown, Grid, Header, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import Line from "components/Line/Line";
import classNames from 'classnames'
import {compact, throttle, uniq} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";

function findNearest(target, numbers) {
  for (let key in Object.keys(numbers).sort()) {
    if (target <= numbers[key]) {
      return key
    }
  }
}

@inject("resourceStore", "uiStore") @observer
export class Script extends React.Component {

  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
  }

  @computed get minLineNo() {
    return this.props.resourceStore.lines.length > 0 ? 1 : null
  }

  @computed get maxLineNo() {
    return this.props.resourceStore.lines.length
  }

  @computed get lines() {
    return this.props.resourceStore.lines
  }

  @observable loading = true
  @observable editingLineId = null
  @observable showNewLineAbove = null
  @observable enableStickyHeader = false
  @observable sliderValue = null
  @observable currentLine = null
  linePositions = {}
  scenePositions = {}

  componentDidMount() {
    window.addEventListener('scroll', throttle(this.handleScroll, 100))
    // window.addEventListener('scroll', this.handleScroll)
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadLines(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => {
      this.loading = false
      this.currentLine = this.minLineNo
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(event) {
    if (!this.autoScrolling) {
      this.currentLine = findNearest(window.pageYOffset, this.linePositions)
      this.sliderValue = null
    }
    this.enableStickyHeader = window.pageYOffset >= this.headerYOffset;
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

  handleScrollToLine() {
    this.currentLine = this.sliderValue
    this.autoScrolling = true
    window.scroll({
      left: 0,
      top: this.linePositions[this.currentLine] - window.outerHeight / 2 + 150, // Trial and error to approximate center scroll
      behavior: 'smooth'
    })
    // hack to account for the time it takes to scroll
    setTimeout(() => this.autoScrolling = false, 2000)
  }

  handleScrollToScene(sceneId) {
    window.scroll({
      left: 0,
      top: this.scenePositions[sceneId] - 110,
      behavior: 'smooth'
    })
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
    const {lines} = this.props.resourceStore
    const currentLine = lines.find(line => line.number === parseInt(this.currentLine))
    if (currentLine) {
      return currentLine.sceneId
    }
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    const {lines} = this.props.resourceStore
    return (
      <Grid className="Script">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Script
            </Header>
            <div
              ref={(node) => {
                if (node && !this.headerYOffset) {
                  this.headerYOffset = node.offsetTop + 8
                }
              }}
              className={classNames('line-navbar', {'sticky': this.enableStickyHeader})}
            >
              <div className='add-line-button'>
                <Button primary icon='plus' onClick={this.handleAddLine} content='Add line'/>
              </div>
              <div className={'line-slider-container'}>
                <strong>Line No</strong>
                <input
                  className='line-slider'
                  type='range'
                  min={this.minLineNo}
                  max={this.maxLineNo}
                  value={this.sliderValue || this.currentLine || 1}
                  onChange={(e) => this.sliderValue = e.target.value}
                  onMouseUp={(e) => this.handleScrollToLine()}
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
                    onChange={(e, data) => this.handleScrollToScene(data.value)}
                  />
                </strong>
                <div className='current-scene-label'>Current scene</div>
              </div>
            </div>
            <Container text className='lines-container'>
              {lines.sort((a, b) => a.number - b.number).map((line, i) => {
                const shouldRenderSceneHeader = () => {
                  if (i === 0) {
                    return true
                  }
                  return (lines[i - 1].sceneId !== line.sceneId)
                }
                return (
                  <React.Fragment key={i}>
                    {shouldRenderSceneHeader() &&
                    <div ref={(elem) => {
                      if (elem) {
                        this.scenePositions[line.sceneId] = elem.offsetTop
                      }
                      }}>
                      <Header as='h2' content={line.scene.title}/>
                    </div>
                    }
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
                    <div ref={(elem) => {
                      if (elem) {
                        this.linePositions[line.number] = elem.offsetTop
                      }
                    }}>
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
