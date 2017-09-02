import {connect} from "react-redux";
import * as React from "react";

import CharacterModal from "./CharacterModal";
import SceneModal from "./SceneModal";
import RoleModal from "./RoleModal";

const MODAL_COMPONENTS = {
  'CHARACTER_MODAL': CharacterModal,
  'SCENE_MODAL': SceneModal,
  'ROLE_MODAL': RoleModal,
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
