function scenesReducer(state = {loading: true, scenes: []}, action) {
  switch (action.type) {
    case 'FETCH_SCENES_SUCCESS':
      return { loading: false, scenes: action.scenes }
    case 'FETCH_SCENES_FAILED':
      return {loading: false, error: true, ...state}
    default:
      return state
  }
}

export default scenesReducer
