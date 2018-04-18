import React from 'react';
import './ScriptImport.scss'
import {Button, Checkbox, Form, Grid, Radio,} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {pull} from 'lodash'
import SuccessModal from "./SuccessModal";

@inject("resourceStore", "uiStore") @observer
export class CandidateSelection extends React.Component {

  @observable loading = false
  @observable selectedTypeGroup = {'scenes': null, 'characters': null}
  @observable selectedTypeByGroup = null
  @observable showSuccessModal = false

  componentWillMount() {
    this.initializeSelectedTypeByGroup()
  }

  initializeSelectedTypeByGroup() {
    const selectedTypeByGroup = {'characters': {}, 'scenes': {}}
    Object.entries(this.props.resourceStore.scriptOptions.character_options).map(([pattern, patternOptions]) => {
      selectedTypeByGroup['characters'][pattern] = Object.keys(patternOptions)
    })

    Object.entries(this.props.resourceStore.scriptOptions.scene_options).map(([pattern, patternOptions]) => {
      selectedTypeByGroup['scenes'][pattern] = Object.keys(patternOptions)
    })

    this.selectedTypeByGroup = selectedTypeByGroup
  }

  handleCheckboxChange(pattern, candidate, type) {
    let typePatterns = this.selectedTypeByGroup[type][pattern]
    if (typePatterns.includes(candidate)) {
      pull(typePatterns, candidate)
    } else {
      typePatterns.push(candidate)
    }
  }


  renderOptions(optionType, options) {
    return Object.entries(options).map(([pattern, patternOptions]) => {
      const isAllSelected = this.selectedTypeByGroup[optionType][pattern].length === Object.keys(patternOptions).length
      return (
        <div className='radio-container' key={pattern}>
          <div className='radio-select'>
            <Radio
              value={pattern}
              onChange={() => this.selectedTypeGroup[optionType] = pattern}
              name={`${optionType}-select`}
              checked={this.selectedTypeGroup[optionType] === pattern}
              label=' '
            />
          </div>
          <div className='radio-content'>
            <Checkbox
              label={pattern}
              disabled={this.selectedTypeGroup[optionType] !== pattern}
              checked={isAllSelected}
              onChange={() => isAllSelected ?
                this.selectedTypeByGroup[optionType][pattern] = [] : this.selectedTypeByGroup[optionType][pattern] = Object.keys(patternOptions)}
            />

            <div className='radio-options-container'>
              {Object.entries(patternOptions).map(([candidate, frequency]) => {
                return (
                  <div key={candidate}>
                    <Checkbox
                      label={`${candidate} (occurred ${frequency} times)`}
                      disabled={this.selectedTypeGroup[optionType] !== pattern}
                      value={candidate}
                      checked={this.selectedTypeByGroup[optionType][pattern].includes(candidate)}
                      onChange={() => this.handleCheckboxChange(pattern, candidate, optionType)}
                    />
                  </div>
                )
              })
              }
            </div>
          </div>
        </div>
      )
    })
  }

  submitSelections() {
    const selections = {
      scenes: {
        scenes: (this.selectedTypeByGroup['scenes'][this.selectedTypeGroup['scenes']] || []).slice(),
        pattern: this.selectedTypeGroup['scenes']
      },
      characters: {
        characters: (this.selectedTypeByGroup['characters'][this.selectedTypeGroup['characters']] || []).slice(),
        pattern: this.selectedTypeGroup['characters']
      },
    }
    const payload = this.props.scriptInput
    payload.selections = selections
    this.loading = true
    this.props.resourceStore.submitScriptOptions(payload).then(() => {
      this.loading = false
      this.showSuccessModal = true
    })
  }

  render() {

    const {scriptOptions, scriptSuccessCounts} = this.props.resourceStore

    return (
      <Grid className="ScriptImport">
        <Grid.Column>
          <h3>
            Character Options
          </h3>
          <Form>
            {this.renderOptions('characters', scriptOptions.character_options)}
          </Form>
          <h3>
            Scene Options
          </h3>
          <Form>
            {this.renderOptions('scenes', scriptOptions.scene_options)}
          </Form>

          <Button
            primary
            content='Submit'
            loading={this.loading}
            onClick={() => this.submitSelections()}
          >

          </Button>
          {this.showSuccessModal && <SuccessModal {...scriptSuccessCounts} />}
        </Grid.Column>
      </Grid>
    );
  }
}

export default CandidateSelection;
