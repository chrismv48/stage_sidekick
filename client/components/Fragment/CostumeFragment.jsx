import React from 'react';
import {Header, Image, Popup} from "semantic-ui-react";
import './Fragment.scss'
import PropTypes from "prop-types";


const CostumeFragmentContent = ({costume}) => {
  return (
    <div className='fragment-container'
         onClick={() => this.store.rootStore.uiStore.showResourceSidebar(costume.id, costume.resource)}
    >
      <div>
        <Image avatar src={costume.avatar}/>
      </div>
      <div style={{textAlign: 'left', marginLeft: '5px'}}>
        <Header
          size='tiny'
        >
          <a style={{cursor: 'pointer'}}>{costume.title}</a>
        </Header>
      </div>
    </div>
  )
}

class CostumeFragment extends React.Component {

  render() {
    const {costume, popup} = this.props

    if (!costume) {
      return null
    }

    if (!popup) {
      return <CostumeFragmentContent costume={costume}/>
    }

    return (
      <Popup
        trigger={CostumeFragmentContent({costume})}
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


CostumeFragment.propTypes = {
  costume: PropTypes.object,
  popup: PropTypes.bool
};

CostumeFragment.defaultProps = {
  popup: false
}


export default CostumeFragment
