import {connect} from "react-redux";
import * as React from "react";

import ResourceModal from "./ResourceModal";

const MODAL_COMPONENTS = {
  'RESOURCE_MODAL' : ResourceModal
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
