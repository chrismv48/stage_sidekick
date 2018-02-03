import React, {PropTypes} from 'react';
import './Actors.scss'
import {Grid, Header} from 'semantic-ui-react'

import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout"

export class Actors extends React.Component {

  render() {
    return (
      <Grid className="actors">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Cast
            </Header>
            <MultipleItemLayout resource='actors' resourceLabel='Actors' hideAddResourceButton />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Actors;
