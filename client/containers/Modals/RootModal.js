import {connect} from "react-redux";
import CharacterModal from "./CharacterModal";
import * as React from "react";

const MODAL_COMPONENTS = {
  'CHARACTER_MODAL': CharacterModal,
  /* other modals */
}

const RootModal = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null
  }
  const SpecificModal = MODAL_COMPONENTS[modalType]
  return <SpecificModal {...modalProps} />
}

export default connect(
  state => state.modal
)(RootModal)
