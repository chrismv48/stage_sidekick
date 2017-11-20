import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router'

const CostumeFragmentContent = (costume) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={costume.display_image.url}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <Link to={`costumes/${costume.id}`} target="_blank">
            {costume.title}
          </Link>
        </Header>
      </div>
    </div>
  )
}

class CostumeFragment extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {costume} = this.props

    if (!costume) {
      return null
    }

    return (
      <Popup
        trigger={CostumeFragmentContent(costume)}
        position='bottom center'
      >
        <Popup.Header>
          {costume.title}
        </Popup.Header>
        <Popup.Content>
          <div className='content-divider'><strong>Description</strong></div>
          {costume.description}
        </Popup.Content>
      </Popup>
    )
  }
}


CostumeFragment.propTypes = {};

export default CostumeFragment
