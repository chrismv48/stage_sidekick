function characterFormReducer(state = {formFields: {}}, action) {
  console.log(action)
  switch (action.type) {
    case 'UPDATE_CHARACTER_FORM':
      const { field, value } = action
      return {...state, formFields: {...state.formFields, [field]: value}}
    default:
      return state
  }
}

export default characterFormReducer
