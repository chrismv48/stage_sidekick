import React, {PropTypes} from 'react';
import './CrossPlot.scss'
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import {sortBy} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";
import {Popup} from "semantic-ui-react";
import {Link} from "react-router-dom";

const CHARACTER_SIDEBAR_WIDTH = 125
const SpanBar = ({span, width, left}) => (
    <div
      className='span'
      style={{width, left}}
      onClick={() => {
        this.props.history.push({pathname: '/script', state: {fromCrossPlot: true, editingSpanId: span.id}})
      }}
    >
      <Link
        style={{width: '100%', height: '100%'}}
        to={{pathname: '/script', state: {fromCrossPlot: true, editingSpanId: span.id}}}
      />
    </div>
)


@inject("resourceStore", "uiStore") @observer
export class CrossPlot extends React.Component {

  @observable loading = true
  @observable hoveredSpanId = null
  @observable containerWidth = null

  containerRef = {}

  @computed get stageActionSpans() {
    return this.props.resourceStore.stage_action_spans
  }

  @computed get sceneSpans() {
    return sortBy(this.stageActionSpans.filter(span => span.isScene()), 'span_start')
  }

  @computed get nonSceneSpans() {
    return this.stageActionSpans.filter(span => !span.isScene())
  }

  @computed get viewCount() {
    return this.props.resourceStore.stageActionsTotalCount
  }

  @computed get characters() {
    return this.props.resourceStore.characters
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadStageActionSpans(),
      this.props.resourceStore.loadStageActions(null, 0)    // only doing this to get the total count, prob need to refactor
    ]).then(() => {
      this.loading = false
    })
  }

  handleWindowResize() {
    this.containerWidth = this.containerRef.offsetWidth - CHARACTER_SIDEBAR_WIDTH
  }

  calculateSpanStartPosition(span, offset = 0) {
    if (this.containerWidth) {
      return Math.round(((span.span_start - offset) / this.viewCount) * this.containerWidth)
    }
  }

  calculateSpanWidth(span) {
    if (this.containerWidth) {
      return Math.round(((span.span_end - span.span_start) / this.viewCount) * this.containerWidth)
    }
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    return (
      <div className="CrossPlot">
        <div
          className='spans-main'
          ref={elem => {
            if (elem) {
              this.containerRef = elem
              this.containerWidth = elem.offsetWidth - CHARACTER_SIDEBAR_WIDTH
            }
          }}
        >
          <div className='scenes-header-container'>
            <div className='characters-sidebar' style={{width: CHARACTER_SIDEBAR_WIDTH}}/>
            {this.sceneSpans.map(sceneSpan => {
              return (
                <div className='scene-span-cell' key={sceneSpan.id} style={{width: this.calculateSpanWidth(sceneSpan)}}>
                  <strong>{sceneSpan.spannable.title}</strong>
                </div>
              )
            })}
          </div>
          <div className='spans-body'>
            {sortBy(this.characters, character => character.firstAppearance()).map(character => {
                return (
                  <div
                    className="character-span-row"
                    key={`character-${character.id}`}
                    style={{height: character.stagePresenceSpans.length > 0 && 50}}
                  >
                    <div className='characters-sidebar' style={{width: CHARACTER_SIDEBAR_WIDTH}}>
                      <strong>{character.name}</strong>
                    </div>

                    {this.sceneSpans.map(sceneSpan => {
                      return (
                        <div className='scene-cell' key={sceneSpan.id}
                             style={{width: this.calculateSpanWidth(sceneSpan)}}
                        >
                          {character.stagePresenceSpans.filter(characterSpan => (characterSpan.startsWithin(sceneSpan))).map(span => {
                            return (
                              <Popup
                                key={span.id}
                                trigger={SpanBar({
                                  span,
                                  width: this.calculateSpanWidth(span),
                                  left: this.calculateSpanStartPosition(span, sceneSpan.span_start)
                                })}
                                position='top center'
                              >
                                <div>Start: {span.span_start}</div>
                                <div>End: {span.span_end}</div>
                                <div>Entrance location: {span.spannable.entrance_location}</div>
                                <div>Exit location: {span.spannable.exit_location}</div>
                              </Popup>

                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CrossPlot;
