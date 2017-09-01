export function setCurrentPage(action) {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return action.currentPage
  }
}
