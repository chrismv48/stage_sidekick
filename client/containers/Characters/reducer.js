function charactersReducer(state = {loading: true, characters: []}, action) {
  switch (action.type) {
    case 'FETCH_CHARACTERS_SUCCESS':
      return { loading: false, characters: action.characters }
    case 'FETCH_CHARACTERS_FAILED':
      return {loading: false, error: true, ...state}
    default:
      return state
  }
}

export default charactersReducer
