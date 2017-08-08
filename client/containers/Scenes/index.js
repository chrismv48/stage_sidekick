const faker = require('faker');
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Scenes.scss'

import {Grid, Header, Image, Item, Label} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import _ from 'lodash'

export class Scenes extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Layout>
        <div className="Scenes">
          <Grid className="content-container">
            <Grid.Row>
              <Grid.Column>
                <Header as="h2" dividing>
                  Scenes
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Item.Group>
                  {_.times(11, (i) => {
                      let imageStr = `${faker.image.imageUrl()}?${faker.random.number({min: 1, max: 1000})}`
                      let characters = _.times(_.random(1, 10), () => <Image avatar src={faker.fake("{{image.avatar}}")}/>)
                      return (
                        <Item key={i} id="scene-item">
                          <Item.Image src={imageStr}/>
                          <Item.Content>
                            <Item.Header>{faker.random.words()}</Item.Header>
                            <Item.Meta>
                              Scene {i + 1}
                            </Item.Meta>
                            <Item.Description>
                              <Grid columns={2} divided>
                                <Grid.Column>
                                  {faker.lorem.sentence(12)}
                                </Grid.Column>
                                <Grid.Column>
                                  <h5>Characters</h5>
                                  {characters}
                                </Grid.Column>
                              </Grid>
                            </Item.Description>
                            <Item.Extra>
                              <Label>IMAX</Label>
                              <Label icon='globe' content='Additional Languages'/>
                            </Item.Extra>
                          </Item.Content>
                        </Item>
                      )
                    }
                  )}
                </Item.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Scenes.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Scenes);
