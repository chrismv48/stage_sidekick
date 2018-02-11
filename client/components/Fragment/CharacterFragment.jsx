import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router-dom'
import PropTypes from "prop-types";

const CharacterFragmentContent = ({character, actor}) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={character.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <Link to={`characters/${character.id}`} target="_blank">
            {character.name}
          </Link>
          {actor &&
          <Header.Subheader>Played by <a href={`/cast/${actor.id}`}>{actor.fullName}</a></Header.Subheader>
          }
        </Header>
      </div>
    </div>
  )
}


class CharacterFragment extends React.Component {

  render() {
    const {character, actor, popup} = this.props

    if (!popup) {
      return <CharacterFragmentContent character={character} actor={actor}/>
    }

    return (
      <Popup
        trigger={() => <CharacterFragmentContent character={character} actor={actor} />}
        position='bottom center'
      >
        <Popup.Header>
          {character.name}
        </Popup.Header>
        <Popup.Content>
          <div className='content-divider'><strong>Played by</strong></div>
          {actor.first_name} {actor.last_name}

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
