export const updateCharacterForm = (field, value) => {
  return {
    type: 'UPDATE_CHARACTER_FORM',
    field,
    value
  }
}

export const submitCharacterForm = () => {
  return {
    type: 'SUBMIT_CHARACTER_FORM',
  }
}


