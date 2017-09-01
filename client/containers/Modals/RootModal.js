import {connect} from "react-redux";
import * as React from "react";

import CharacterModal from "./CharacterModal";
import SceneModal from "./SceneModal";

const MODAL_COMPONENTS = {
  'CHARACTER_MODAL': CharacterModal,
  'SCENE_MODAL': SceneModal,
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
