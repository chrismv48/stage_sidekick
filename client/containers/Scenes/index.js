import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Scenes.scss'

import {Grid, Header, Image, Item, Label} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";

@connect(state => {
  const { dispatch } = state
  return {
    dispatch,
    scenes: state.scenes
  }
})

class Scenes extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { scenes } = this.props
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
                  {this.props.scenes.map((scene, i) => {
                      let characters = scene.characterImageStrs.map(imageStr => <Image avatar src={imageStr}/>)
                      return (
                        <Item key={i} id="scene-item">
                          <Item.Image src={scene.imageStr}/>
                          <Item.Content>
                            <Item.Header>{scene.title}</Item.Header>
                            <Item.Meta>
                              Scene {scene.orderIndex + 1}
                            </Item.Meta>
                            <Item.Description>
                              <Grid columns={2} divided>
                                <Grid.Column>
                                  {scene.description}
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
  scenes: PropTypes.array
};

export default Scenes
