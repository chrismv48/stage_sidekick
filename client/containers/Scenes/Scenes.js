import React from 'react';
import './Scenes.scss'

import {Grid, Header} from 'semantic-ui-react'
import MultipleItemLayout from "../../components/MultipleItemLayout/MultipleItemLayout";


class Scenes extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
        <Grid className="Scenes">
          <Grid.Row>
            <Grid.Column>
              <Header as="h2" dividing>
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
