const initialState = {
  sidebarType: null,
  sidebarProps: {}
}

function detailSidebar(state = initialState, action) {
  const {sidebarType, sidebarProps} = action
  switch (action.type) {
    case 'SHOW_DETAIL_SIDEBAR':
      return {
        sidebarType,
        sidebarProps
      }
    case 'HIDE_DETAIL_SIDEBAR': {
      return initialState
    }
    default:
      return state
  }
}

export default detailSidebar
