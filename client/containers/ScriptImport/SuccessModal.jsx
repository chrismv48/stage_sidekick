import React from 'react';
import './ScriptImport.scss'
import {Button, Header, Modal,} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import PropTypes from "prop-types";


@inject("resourceStore", "uiStore") @observer
export class SuccessModal extends React.Component {

  render() {
    const {characterCount, sceneCount, lineCount} = this.props
    return (
      <Modal open>
        <Header content='Script successfully imported!'/>
        <Modal.Content>
          <ul>
            <li>Created {sceneCount} scenes</li>
            <li>Created {characterCount} characters</li>
            <li>Created {lineCount} lines</li>
          </ul>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            onClick={() => window.location.href = '/script'}
          >
            Continue
          </Button>
        </Modal.Actions>:
      </Modal>
    );
  }
}

SuccessModal.propTypes = {
  characterCount: PropTypes.number,
  sceneCount: PropTypes.number,
  lineCount: PropTypes.number
}

SuccessModal.defaultProps = {
  characterCount: 0,
  sceneCount: 0,
  lineCount: 0,
}

export default SuccessModal;
