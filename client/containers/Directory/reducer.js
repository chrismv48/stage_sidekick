function directoryReducer(state = {loading: true, staff: []}, action) {
  switch (action.type) {
    case 'FETCH_DIRECTORY_SUCCESS':
      return { loading: false, staff: action.staff }
    case 'FETCH_DIRECTORY_FAILED':
      return {loading: false, error: true, ...state}
    default:
      return state
  }
}

export default directoryReducer
