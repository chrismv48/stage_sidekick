import React from 'react';
import PropTypes from 'prop-types'
import './StageActionSpan.scss'
import {Button, Form} from "semantic-ui-react";
import {inject, observer} from "mobx-react/index";
import {computed} from "mobx";


const spanTypeLabels = {
  "Scene": "Scene",
  "StagePresence": "Character",
  "Song": "Song"
}

@inject("resourceStore", "uiStore") @observer
class StageActionSpanForm extends React.Component {

  @computed get spanStaged() {
    const spanStaged = this.props.resourceStore.getStagedResource('stage_action_spans', this.props.spanId)

    // break link to spannable object so modifications aren't carried through before they're saved
    spanStaged.spannable = Object.assign({}, spanStaged.spannable)
    return spanStaged
  }

  @computed get generateSpanItemOptions() {
    if (this.spanStaged.spannable_type === 'Scene') {
      return this.props.resourceStore.dropdownOptions('scenes')
    } else if (this.spanStaged.spannable_type === 'StagePresence') {
      return this.props.resourceStore.dropdownOptions('characters')
    } else {
      return []
    }
  }

  @computed get spannableTypeFormValue() {
    if (this.spanStaged.isStagePresence()) {
      return this.spanStaged.spannable.character_id
    } else {
      return this.spanStaged.spannable_id
    }
  }

  handleChangeSpannableItem(value) {
    if (this.spanStaged.isStagePresence()) {
      this.spanStaged.spannable = {character_id: value}
    } else {
      this.spanStaged.spannable_id = value
    }
  }

  render() {
    const {handleSave, handleCancel, handleSearchLineNumber} = this.props
    return (
      <Form>
        <Form.Group>
          <Form.Select
            label='Type'
            options={this.spanStaged.model.constructor.spanTypeDropdownOptions}
            width={4}
            value={this.spanStaged.spannable_type}
            onChange={(event, data) => this.spanStaged.spannable_type = data.value}
          />
          <Form.Select
            label={spanTypeLabels[this.spanStaged.spannable_type] || ''}
            disabled={!this.spanStaged.spannable_type}
            options={this.generateSpanItemOptions}
            width={4}
            onChange={(event, data) => this.handleChangeSpannableItem(data.value)}
            value={this.spannableTypeFormValue}
          />
          <Form.Input
            label='Start'
            value={this.spanStaged.span_start}
            action={{icon: 'search', color: 'teal', onClick: () => handleSearchLineNumber(this.spanStaged.span_start)}}
            width={2}
            onChange={(e) => this.spanStaged.span_start = e.target.value}
          />
          <Form.Input
            label='End'
            value={this.spanStaged.span_end || ''}
            width={2}
            action={{icon: 'search', color: 'teal', onClick: () => handleSearchLineNumber(this.spanStaged.span_end)}}
            onChange={(e) => this.spanStaged.span_end = e.target.value}
          />
        </Form.Group>

        {this.spanStaged.isStagePresence() &&
        <Form.Group>
          <Form.Input
            label='Entrance Location'
            value={this.spanStaged.spannable.entrance_location}
            onChange={event => this.spanStaged.spannable.entrance_location = event.target.value}
          />
          <Form.Input
            label='Exit Location'
            value={this.spanStaged.spannable.exit_location}
            onChange={event => this.spanStaged.spannable.exit_location = event.target.value}
          />
        </Form.Group>
        }
        <Button primary content='Save' icon='checkmark' onClick={e => handleSave(e)}/>
        <Button basic content='Cancel' icon='remove' onClick={e => handleCancel(e)}/>
      </Form>
    )
  }
}

StageActionSpanForm.propTypes = {
  spanId: PropTypes.number,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSearchLineNumber: PropTypes.func
};

StageActionSpanForm.defaultProps = {
  isStart: true
}

export default StageActionSpanForm
