import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import PropTypes from "prop-types";


const CostumeItemFragmentContent = ({costumeItem}) => {
  return (
    <div className='fragment-container'
         onClick={() => costumeItem.store.rootStore.uiStore.showResourceSidebar(costumeItem.id, costumeItem.resource)}
    >
      <div>
        <Image avatar src={costumeItem.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header size='tiny'>
          <a style={{cursor: 'pointer'}}>{costumeItem.title}</a>
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
