import React from 'react';
import './ScriptImport.scss'
import {Button, Checkbox, Form, Grid, Radio,} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {pull} from 'lodash'

@inject("resourceStore", "uiStore") @observer
export class ScriptImport extends React.Component {

  @observable loading = true
  @observable selectedTypeGroup = {'scenes': [], 'characters': []}
  @observable selectedTypeByGroup = null

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
      return (
        <div className='radio-container'>
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
            <strong>{pattern}</strong>
            <div className='radio-options-container'>
              {Object.entries(patternOptions).map(([candidate, frequency]) => {
                return (
                  <div>
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
      }
    }
    console.log(selections)
    this.props.resourceStore.submitScriptOptions(selections)
  }

  render() {

    const {scriptOptions} = this.props.resourceStore
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
            content='Submit'
            onClick={() => this.submitSelections()}
          >

          </Button>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ScriptImport;
