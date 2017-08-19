function characterReducer(state = {loading: false, character: {}}, action) {
  switch (action.type) {
    case 'FETCH_CHARACTER_INITIATED':
      return {...state, loading: true}
    case 'FETCH_CHARACTER_SUCCESS':
      return { loading: false, character: action.character }
    case 'FETCH_CHARACTER_FAILED':
      return {loading: false, error: true, ...state}
    default:
      return state
  }
}

export default characterReducer
