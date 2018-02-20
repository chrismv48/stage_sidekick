import React from "react";

import ResourceModal from "./ResourceModal";
import {inject, observer} from "mobx-react";

const MODAL_COMPONENTS = {
  'RESOURCE_MODAL' : ResourceModal
  /* other modals */
}

const RootModal = inject("uiStore")(observer(({uiStore: {modalType, modalProps}}) => {

  if (!modalType) {
    return null
  }
  const SpecificModal = MODAL_COMPONENTS[modalType]
  return <SpecificModal {...modalProps} />
}))

export default RootModal
