import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

const SceneFragmentContent = ({scene}) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={scene.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <Link to={`scenes/${scene.id}`} target="_blank">
            {scene.order_index} - {scene.title}
          </Link>
          <Header.Subheader>{scene.setting} | {scene.length_in_minutes}m</Header.Subheader>
        </Header>
      </div>
    </div>
  )
}

class SceneFragment extends React.Component {

  render() {
    const {scene, popup} = this.props

    if (!popup) {
      return (
        <SceneFragmentContent scene={scene}/>
      )
    }

    return (
      <Popup
        trigger={SceneFragmentContent({scene})}
        position='bottom center'
      >
        <Popup.Header>
          {scene.order_index} - {scene.title}
        </Popup.Header>
        <Popup.Content>
          <div className='content-divider'><strong>Setting</strong></div>
          {scene.setting}

          <div className='content-divider'><strong>Runtime</strong></div>
          {scene.length_in_minutes} minutes

          <div className='content-divider'><strong>Description</strong></div>
          {scene.description}
        </Popup.Content>
      </Popup>
    )
  }
}


SceneFragment.propTypes = {
  scene: PropTypes.object.isRequired,
  popup: PropTypes.bool
};

SceneFragment.defaultProps = {
  popup: false
}

export default SceneFragment
