import React from 'react';
import './Scenes.scss'

import {Grid, Header} from 'semantic-ui-react'
import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout";
import DisplayModeIcons from "components/DisplayModeIcons/DisplayModeIcons";


class Scenes extends React.Component {

  render() {
    return (
        <Grid className="Scenes">
          <Grid.Row>
            <Grid.Column>
              <Header as="h2" dividing>
                <span style={{float: 'right'}}>
                <DisplayModeIcons/>
              </span>
                Scenes
              </Header>
              <MultipleItemLayout resource='scenes' resourceLabel='Scenes' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

export default Scenes
