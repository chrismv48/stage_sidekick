export const showModal = (modalType, modalProps) => {
  return {
    type: 'SHOW_MODAL',
    modalType,
    modalProps
  }
}

export const hideModal = () => {
  return {
    type: 'HIDE_MODAL'
  }
}

