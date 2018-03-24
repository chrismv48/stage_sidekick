import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

const ActorFragmentContent = ({actor}) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={actor.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <Link to={`cast/${actor.id}`}>
            {actor.fullName}
          </Link>
        </Header>
      </div>
    </div>
  )
}

class ActorFragment extends React.Component {

  render() {
    const {actor, popup} = this.props

    if (!actor) {
      return null
    }

    if (!popup) {
      return (
        <ActorFragmentContent actor={actor}/>
      )
    }

    return (
      <Popup
        trigger={() => <ActorFragmentContent actor={actor}/>}
        position='bottom center'
      >
        <Popup.Header>
          {actor.title}
        </Popup.Header>
        <Popup.Content>
          <div className='content-divider'><strong>Description</strong></div>
          {actor.description}
        </Popup.Content>
      </Popup>
    )
  }
}


ActorFragment.propTypes = {
  actor: PropTypes.object.isRequired,
  popup: PropTypes.bool
}

ActorFragment.defaultProps = {
  popup: false
}

export default ActorFragment
