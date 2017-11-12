import React, {PropTypes} from 'react';
import './Characters.scss'
import {Grid, Header} from 'semantic-ui-react'
import MultipleItemLayout from "../../components/MultipleItemLayout/MultipleItemLayout";

export class Characters extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      selectedCharacterId: null,
      flippedCards: new Set(),
    }
  }

  render() {
    return (
      <Grid className="characters">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Characters
            </Header>
            <MultipleItemLayout resource='characters' resourceLabel='Characters'/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Characters.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default Characters;
