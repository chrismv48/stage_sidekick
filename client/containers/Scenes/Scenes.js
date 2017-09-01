import React from 'react';
import {connect} from 'react-redux';
import './Scenes.scss'

import {Button, Grid, Header, Icon, Image, Item, Label} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {fetchResource} from "../../api/actions";
import {showModal} from "../Modals/actions";
import * as _ from "lodash";

const faker = require('faker')

@connect(state => {
  const {
    dispatch,
    scenes = {},
    characters: {byId: charactersById} = {},
  } = state.entities
  return {
    dispatch,
    scenes,
    charactersById,
  }
})

class Scenes extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(fetchResource('scenes', 'scenes'))
  }

  render() {
    const {byId: scenesById, allIds: scenesAllIds = []} = this.props.scenes
    const {charactersById, dispatch} = this.props
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
                <Button onClick={() => dispatch(showModal('SCENE_MODAL', {sceneId: null}))} primary>
                  <Icon name='add user'/>
                  Add Scene
                </Button>
                <Item.Group>
                  {scenesAllIds.map((sceneId, i) => {
                    const scene = scenesById[sceneId]
                    let character_avatars = scene.characters.map((characterId, i) => {
                      const characterImageUrl = _.get(charactersById, `${characterId}.display_image.url`, null)
                      return (
                        <Image key={i} avatar src={characterImageUrl}/>
                      )
                    })
                    const sceneImageUrl = _.get(scene, 'display_image.url', null)
                    return (
                      <Item key={i} id="scene-item" style={{position: 'relative'}}>
                        <Icon
                          name="edit"
                          color="grey"
                          style={{position: 'absolute', top: 0, right: 0, margin: 5, cursor: 'pointer'}}
                          onClick={() => dispatch(showModal('SCENE_MODAL', {sceneId}))}
                        />
                        <Item.Image src={sceneImageUrl}/>
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

export default Scenes
