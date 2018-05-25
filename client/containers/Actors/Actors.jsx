import React, {PropTypes} from 'react';
import './Actors.scss'
import {Header} from 'semantic-ui-react'
import {computed, observable} from "mobx";
import {observer} from "mobx-react/index";

import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout"
import DisplayModeIcons from "components/DisplayModeIcons/DisplayModeIcons";

@observer
export class Actors extends React.Component {

  render() {
    return (
      <div className="Actors main-content">
        <Header as="h2" dividing>
          <span style={{float: 'right'}}>
            <DisplayModeIcons/>
          </span>
          Cast
        </Header>
        <MultipleItemLayout
          resource='actors'
          resourceLabel='Actors'
          hideAddResourceButton
        />
      </div>
    );
  }
}

export default Actors;
