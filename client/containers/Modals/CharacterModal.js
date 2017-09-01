import {hideModal} from "./actions";
import {Button, Header, Modal} from "semantic-ui-react";
import {CharacterForm} from "../CharacterForm/CharacterForm";
import * as React from "react";
import * as _ from "lodash";
import {connect} from "react-redux";
import {createResource, modifyResource} from "../../api/actions";

@connect((state, ownProps) => {
  const {
    dispatch,
    characters = {}
  } = state.entities
  const characterStaged = _.get(characters, `staging.${ownProps.characterId}`, {})
  const success = characters.success
  return {
    dispatch,
    characterStaged,
    success
  }
})

export default class CharacterModal extends React.Component {

  componentWillReceiveProps(nextProps) {
    const {characterStaged: newCharacterStaged} = nextProps
    const { characterStaged, success, dispatch } = this.props
    if (success && !_.isEmpty(characterStaged) && _.isEmpty(newCharacterStaged)) { dispatch(hideModal()) }
  }

  handleCharacterSubmit = () => {
    const { characterStaged, characterId, dispatch } = this.props
    if (characterId) {
      dispatch(modifyResource('characters', `characters/${characterId}`, characterStaged))
    }
    else {
      dispatch(createResource('characters', 'characters', characterStaged))
    }
  }

  render() {
    const {characterId, characterStaged, dispatch} = this.props

    let iconName = 'add user'
    let modalHeading = 'Add New Character'
    if (characterId) {
      iconName = 'edit'
      modalHeading = 'Edit Character'
    }

    return (
      <Modal
        open={true}
        onClose={() => dispatch(hideModal())}
        closeIcon='close'>
        <Header icon={iconName} content={modalHeading}/>
        <Modal.Content>
          <CharacterForm characterId={characterId}/>
        </Modal.Content>
        <Modal.Actions>
          <Button primary
                  onClick={this.handleCharacterSubmit}
                  disabled={_.isEmpty(characterStaged)}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
