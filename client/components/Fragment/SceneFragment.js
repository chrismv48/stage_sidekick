import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router'

const SceneFragmentContent = (scene) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={scene.display_image.url}/>
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


class SceneFragment extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {scene} = this.props
    return (
      <Popup
        trigger={SceneFragmentContent(scene)}
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


SceneFragment.propTypes = {};

export default SceneFragment
