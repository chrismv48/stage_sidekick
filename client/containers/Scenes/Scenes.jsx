import React from 'react';
import './Scenes.scss'

import {Header} from 'semantic-ui-react'
import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout";
import DisplayModeIcons from "components/DisplayModeIcons/DisplayModeIcons";


class Scenes extends React.Component {

  render() {
    return (
      <div className="Scenes main-content">
        <Header as="h2" dividing>
          <span style={{float: 'right'}}>
          <DisplayModeIcons/>
        </span>
          Scenes
        </Header>
        <MultipleItemLayout resource='scenes' resourceLabel='Scenes' />
      </div>
    );
  }
}

export default Scenes
