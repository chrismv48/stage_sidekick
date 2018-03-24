import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import {Link} from 'react-router-dom'
import PropTypes from "prop-types";


const CostumeItemFragmentContent = ({costumeItem}) => {
  return (
    <div className='fragment-container'>
      <div>
        <Image avatar src={costumeItem.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <Link to={costumeItem.href} target="_blank">
            {costumeItem.title}
          </Link>
        </Header>
      </div>
    </div>
  )
}

class CostumeItemFragment extends React.Component {

  render() {
    const {costumeItem, popup} = this.props

    if (!costumeItem) {
      return null
    }

    if (!popup) {
      return <CostumeItemFragmentContent costumeItem={costumeItem}/>
    }

    return (
      <Popup
        trigger={CostumeItemFragmentContent({costumeItem})}
        position='bottom center'
      >
        <Popup.Header>
          {costumeItem.title}
        </Popup.Header>
        <Popup.Content>
          <div className='content-divider'><strong>Description</strong></div>
          {costumeItem.description}
        </Popup.Content>
      </Popup>
    )
  }
}


CostumeItemFragment.propTypes = {
  costumeItem: PropTypes.object,
  popup: PropTypes.bool
};

CostumeItemFragment.defaultProps = {
  popup: false
}


export default CostumeItemFragment
