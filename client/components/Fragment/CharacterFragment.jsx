import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router-dom'

const CharacterItemContent = (character, actor) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={character.primary_image}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <Link to={`characters/${character.id}`} target="_blank">
            {character.name}
          </Link>
          <Header.Subheader>Played by {actor.first_name} {actor.last_name}</Header.Subheader>
        </Header>
      </div>
    </div>
  )
}


class CharacterFragment extends React.Component {

  render() {
    const {character, actor} = this.props
    return (
      <Popup
        trigger={CharacterItemContent(character, actor)}
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


CharacterFragment.propTypes = {};

export default CharacterFragment
