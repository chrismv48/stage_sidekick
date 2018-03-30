import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import PropTypes from "prop-types";

const CharacterFragmentContent = (character, actor) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={character.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <a
            style={{cursor: 'pointer'}}
            onClick={() => this.store.rootStore.uiStore.showResourceSidebar(character.id, character.resource)}
          >
            {character.name}
          </a>
          {actor &&
          <Header.Subheader>Played by <a style={{cursor: 'pointer'}}
                                         onClick={() => this.store.rootStore.uiStore.showResourceSidebar(actor.id, actor.resource)}
          >{actor.fullName}</a></Header.Subheader>
          }
        </Header>
      </div>
    </div>
  )
}


class CharacterFragment extends React.Component {

  render() {
    const {character, actor, popup} = this.props

    if (!character) {
      return null
    }

    if (!popup) {
      return CharacterFragmentContent(character, actor)
    }

    return (
      <Popup
        trigger={CharacterFragmentContent(character, actor)}
        position='bottom center'
      >
        <Popup.Header>
          {character.name}
        </Popup.Header>
        <Popup.Content>
          {actor &&
          <React.Fragment>
            <div className='content-divider'><strong>Played by</strong></div>
            {actor.first_name} {actor.last_name}
          </React.Fragment>
          }
          <div className='content-divider'><strong>Description</strong></div>
          {character.description}
        </Popup.Content>
      </Popup>
    )
  }
}


CharacterFragment.propTypes = {
  character: PropTypes.object.isRequired,
  actor: PropTypes.object,
  popup: PropTypes.bool
}

CharacterFragment.defaultProps = {
  popup: false
}

export default CharacterFragment
