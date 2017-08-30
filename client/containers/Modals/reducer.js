const initialState = {
  modalType: null,
  modalProps: {}
}

function rootModal(state = initialState, action) {
  const {modalType, modalProps} = action
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        modalType,
        modalProps
      }
    case 'HIDE_MODAL': {
      return initialState
    }
    default:
      return state
  }
}

export default rootModal
