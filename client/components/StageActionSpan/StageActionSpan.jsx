import React from 'react';
import PropTypes from 'prop-types'
import './StageActionSpan.scss'
import {Dropdown} from "semantic-ui-react";
import {inject, observer} from "mobx-react/index";
import {computed} from "mobx";
import {Link} from "react-router-dom";

class SpanLink extends React.Component {
  render() {
    const {handleClick, text} = this.props
    return (
      <p
        className='span-link'
        onClick={() => handleClick()}
      >
        {text}
      </p>
    )
  }
}

@inject("resourceStore", "uiStore") @observer
class StageActionSpan extends React.Component {

  @computed get span() {
    return this.props.resourceStore.stage_action_spans.find(span => span.id === this.props.spanId)
  }

  @computed get isScene() {
    return this.span.spannable_type === 'Scene'
  }

  @computed get isEntrance() {
    return this.span.spannable_type === 'Entrance'
  }

  @computed get isExit() {
    return this.span.spannable_type === 'Exit'
  }

  @computed get isSong() {
    return this.span.spannable_type === 'Song'
  }

  @computed get shouldRender() {
    return this.isScene && !this.props.isStart
  }

  renderSpan() {
    switch (this.span.spannable_type) {
      case 'Scene':
        return this.renderSceneSpan();
      case 'StagePresence':
        return this.renderStagePresenceSpan();
      case 'Song':
        return this.renderSongSpan();
      default:
        return
    }
  }

  renderSceneSpan() {
    if (this.props.isStart) {
      return (
        <div className="span-container">
          <div>
            <div className='span-label'>Scene Start</div>
            <h3>{this.span.spannable.title}</h3>
          </div>
          <div>
            <SpanLink
              handleClick={() => this.props.handleJumpToLine(this.span.span_end)}
              text={`Ends on ${this.span.span_end}`}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="span-container">
          <div>
            <div className='span-label'>Scene End</div>
            <p>Scene ended: {this.span.spannable.title}</p>
          </div>
          <div>
            <SpanLink
              handleClick={() => this.props.handleJumpToLine(this.span.span_start)}
              text={`Begins on ${this.span.span_start}`}
            />
          </div>
        </div>
      )
    }
  }

  renderStagePresenceSpan() {
    const character = this.props.resourceStore.characters.find(character => character.id === this.span.spannable.character_id)
    if (this.props.isStart) {
      return (
        <div className='span-container'>
          <div>
            <div className='span-label'>Character Entrance</div>
            <p className='entrance-exit'><Link
              to={character.href}>{character.name}</Link> enters {this.span.spannable.entrance_location}</p>
          </div>
          <div>
            <SpanLink
              handleClick={() => this.props.handleJumpToLine(this.span.span_end)}
              text={`Exits on ${this.span.span_end}`}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className='span-container'>
          <div>
            <div className='span-label'>Character Exit</div>
            <p className='entrance-exit'><Link
              to={character.href}>{character.name}</Link> exits {this.span.spannable.exit_location}</p>
          </div>
          <div>
            <SpanLink
              handleClick={() => this.props.handleJumpToLine(this.span.span_start)}
              text={`Enters on ${this.span.span_start}`}
            />
          </div>
        </div>
      )
    }
  }

  renderSongSpan() {

  }

  render() {
    const {handleEdit, handleDelete} = this.props
    return (
      <div className='StageActionSpan'>
        {this.renderSpan()}
        <div className='edit-icon'>
          <Dropdown icon='ellipsis horizontal' pointing='right'>
            <Dropdown.Menu>
              <Dropdown.Item icon='edit' text='Edit' onClick={() => handleEdit()} />
              <Dropdown.Item icon='trash' text='Delete' onClick={() => handleDelete()} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    )
  }
}

StageActionSpan.propTypes = {
  spanId: PropTypes.number.isRequired,
  handleJumpToLine: PropTypes.func.isRequired,
  isStart: PropTypes.bool.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
};

StageActionSpan.defaultProps = {
  isStart: true
}

export default StageActionSpan
