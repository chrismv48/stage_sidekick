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

export const fetchCharacters = () => {
  return {
    type: 'FETCH_CHARACTERS'
  }
}

export const fetchScenes = () => {
  return {
    type: 'FETCH_SCENES'
  }
}

export const fetchCharacter = (characterId) => {
  return {
    type: 'FETCH_CHARACTER',
    characterId
  }
}

