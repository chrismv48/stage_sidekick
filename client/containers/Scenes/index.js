import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Scenes.scss'

import {Grid, Header, Image, Item, Label} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {fetchScenes} from "../../actions";

const faker = require('faker')

@connect(state => {
  const { dispatch, scenes: {scenes, loading} } = state
  return {
    dispatch,
    scenes,
    loading
  }
})

class Scenes extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(fetchScenes())
  }

  render() {
    const { scenes, loading } = this.props
    return (
      <Layout thisPage={this.props.route.name}>
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
                  {!loading && scenes.map((scene, i) => {
                      let character_avatars = scene.characters.map(imageStr => <Image avatar src={faker.fake("{{image.avatar}}")}/>)
                      let imageStr = `${faker.image.people()}?${faker.random.number({min: 1, max: 1000})}`
                      return (
                        <Item key={i} id="scene-item">
                          <Item.Image src={imageStr}/>
                          <Item.Content>
                            <Item.Header>{scene.title}</Item.Header>
                            <Item.Meta>
                              Scene {scene.order_index + 1}
                            </Item.Meta>
                            <Item.Description>
                              <Grid columns={2} divided>
                                <Grid.Column>
                                  {scene.description}
                                </Grid.Column>
                                <Grid.Column>
                                  <h5>Characters</h5>
                                  {character_avatars}
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
  scenes: PropTypes.array
};

export default Scenes
