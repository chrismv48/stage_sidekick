export function setCurrentPage(action) {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return action.currentPage
  }
}

export const fetchDirectory = () => {
  return {
    type: 'FETCH_DIRECTORY'
  }
}
