import React from 'react';
import './DisplayModeIcons.scss'
import {inject, observer} from "mobx-react";
import classNames from "classnames";
import {Icon} from "semantic-ui-react";

@inject("uiStore") @observer
class DisplayModeIcons extends React.Component {

  render() {
    const {setDisplayMode, displayMode} = this.props.uiStore
    return (
      <span className='DisplayModeIcons'>
        <Icon
          className={classNames('display-mode-icon', {'selected': displayMode === 'cards'})}
          name='block layout'
          onClick={() => setDisplayMode('cards')}
        />
        <Icon
          className={classNames('display-mode-icon', {'selected': displayMode === 'table'})}
          name='table'
          onClick={() => setDisplayMode('table')}
        />
      </span>
    )
  }
}

DisplayModeIcons.propTypes = {};

export default DisplayModeIcons
