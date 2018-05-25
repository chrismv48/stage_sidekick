import React, {PropTypes} from 'react';
import './Characters.scss'
import {Header} from 'semantic-ui-react'

import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout"
import DisplayModeIcons from "components/DisplayModeIcons/DisplayModeIcons";

export class Characters extends React.Component {

  render() {
    return (
      <div className="characters main-content">
        <Header as="h2" dividing>
          <span style={{float: 'right'}}>
            <DisplayModeIcons/>
          </span>
          Characters
        </Header>
        <MultipleItemLayout resource='characters' resourceLabel='Characters'/>
      </div>
    );
  }
}

export default Characters;
