import React, {PropTypes} from 'react';
import './CrossPlot.scss'
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import {sortBy} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";

const CHARACTER_SIDEBAR_WIDTH = 125

@inject("resourceStore", "uiStore") @observer
export class CrossPlot extends React.Component {

  @observable loading = true

  @observable containerRef = {}

  @computed get containerWidth() {
    return this.containerRef.offsetWidth - CHARACTER_SIDEBAR_WIDTH
  }

  @computed get stageActionSpans() {
    return this.props.resourceStore.stage_action_spans
  }

  @computed get sceneSpans() {
    return sortBy(this.stageActionSpans.filter(span => span.isScene()), span => span.span_start)
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

  calculateSpanStartPosition(span, offset = 0) {
    if (this.containerWidth) {
      return Math.round(((span.span_start - offset) / this.viewCount) * this.containerWidth)
    }
  }

  calculateSpanWidth(span) {
    if (this.containerWidth) {
      debugger
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
            }
          }}
        >
          <div className='scenes-header-container'>
            <div className='characters-sidebar' style={{width: CHARACTER_SIDEBAR_WIDTH}}>Characters</div>
            {this.sceneSpans.map(sceneSpan => {
              return (
                <div className='scene-span-cell' key={sceneSpan.id} style={{width: this.calculateSpanWidth(sceneSpan)}}>
                  <strong>{sceneSpan.spannable.title}</strong>
                </div>
              )
            })}
          </div>
          <div className='spans-body'>
            {this.characters.map(character => {
                return (
                  <div
                    className="character-span-row"
                    key={`character-${character.id}`}
                    style={{height: character.stagePresenceSpans.length > 0 && 50}}
                  >
                    <div className='characters-sidebar' style={{width: CHARACTER_SIDEBAR_WIDTH}}>{character.name}</div>

                    {this.sceneSpans.map(sceneSpan => {
                      return (
                        <div className='scene-cell' key={sceneSpan.id}
                             style={{width: this.calculateSpanWidth(sceneSpan)}}>
                          {character.stagePresenceSpans.filter(characterSpan => (characterSpan.startsWithin(sceneSpan))).map(span => {
                            return (
                              <div className='span' style={{width: this.calculateSpanWidth(span), left: this.calculateSpanStartPosition(span, sceneSpan.span_start)}} key={span.id}/>
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
