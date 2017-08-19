/*
 *
 * Character
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {CharacterForm} from "../CharacterForm/index";
import {Button} from "semantic-ui-react";
import _ from 'lodash'
import {submitCharacterForm, updateCharacterForm} from "../CharacterForm/actions";

@connect(state => {
  const {
    dispatch,
    character: {character, loading},
    characterForm: {formFields}
  } = state
  return {
    dispatch,
    character,
    loading,
    formFields
  }
})

export class Character extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    // this.props.dispatch(fetchScenes())
  }

  handleCharacterSubmit = () => {
    this.props.dispatch(updateCharacterForm('id', this.props.params.characterId))
    this.props.dispatch(submitCharacterForm())
  }

  render() {
    const {formFields} = this.props
    return (
      <div>
        <CharacterForm characterId={this.props.params.characterId}/>
        <Button onClick={this.handleCharacterSubmit} disabled={_.isEmpty(formFields)} primary>Save</Button>
      </div>
    );
  }
}

Character.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default Character
