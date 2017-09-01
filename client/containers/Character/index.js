/*
 *
 * Character
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {CharacterForm} from "../CharacterForm/CharacterForm";
import {Button} from "semantic-ui-react";
import _ from 'lodash'

@connect(state => {
  const {
    dispatch,
    character: {character, loading, formFields = {}},
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
