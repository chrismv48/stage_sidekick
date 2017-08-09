export function setCurrentPage(action) {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return action.currentPage
  }
}




function step(state = 1, action) {
  switch (action.type) {
    case "UPDATE_STEP":
      return action.step

    default:
      return state
  }
}
