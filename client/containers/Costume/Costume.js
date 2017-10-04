import React from 'react';
import {connect} from 'react-redux';
import './Costume.scss'
import {Card, Dimmer, Dropdown, Grid, Header, Icon, Image, Item, Label, List, Loader,} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {fetchResource} from "../../api/actions"
import * as _ from "lodash";
import {showModal} from "../Modals/actions";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {costumeId} = ownProps.params
  const costume = _.get(state.resources, `costumes.byId.${costumeId}`, {})
  const {
    characters: {byId: charactersById} = {},
    roles: {byId: rolesById} = {},
    scenes: {byId: scenesById} = {},
    costume_items: {byId: costumeItemsById = {}, allIds: costumeItemsAllIds = []} = {},
  } = state.resources
  return {
    dispatch,
    costume,
    charactersById,
    scenesById,
    rolesById,
    costumeItemsAllIds,
    costumeItemsById,
  }
})

export class Costume extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('costumes', `costumes/${this.props.params.costumeId}`))
    // TODO: being lazy here and getting all characters/scenes even though we really only need some
    this.props.dispatch(fetchResource('characters', 'characters'))
    this.props.dispatch(fetchResource('scenes', 'scenes'))
    this.props.dispatch(fetchResource('roles', 'roles'))
    this.props.dispatch(fetchResource('costume_items', 'costume_items'))
  }

  groupCharacterScenes() {
    const {costume} = this.props
    let groupedCharacterScenes = {}
    for (const costumeCharacterScene of costume.costumes_characters_scenes || []) {
      const {characters_scene_id: characterSceneId, character_id: characterId} = costumeCharacterScene
      if (characterId in groupedCharacterScenes) {
        groupedCharacterScenes[characterId].push(characterSceneId)
      }
      else {
        groupedCharacterScenes[characterId] = characterSceneId ? [characterSceneId] : []
      }
    }
    return groupedCharacterScenes
  }

  render() {
    const { costume, charactersById, rolesById, scenesById, costumeItemsAllIds, costumeItemsById, dispatch } = this.props
    if (!charactersById || !rolesById || !scenesById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }
    const groupedCharacterScenes = this.groupCharacterScenes()
    return (
      <Layout thisPage={this.props.route.name}>
        <div className="Costume">
          <Grid className="content-container">
            <Grid.Column>
              <Header as="h2">
                <Image shape='circular' src={_.get(costume, 'display_image.url')}/>
                {costume.title}
              </Header>
              <Header as='h3' dividing>
                Description
              </Header>
              <p>
                {costume.description}
              </p>
              <Header as='h3' dividing>
                Costume Items
              </Header>
              <Card.Group>
                {costume.costume_item_ids.map((costumeItemId) => {
                    let costumeItem = costumeItemsById[costumeItemId]
                    const costumeItemImageUrl = costumeItem.display_image ? costumeItem.display_image.url : null
                    // const costumeRole = _.isEmpty(costume.roles) ? null : rolesById[costume.roles[0]]
                    return (
                      <Card raised key={costumeItemId} className="costume-card">
                        <div key={costumeItemId} className="card-edit-panel">
                          <Icon style={{height: "initial"}} name="move"/>
                          <div className="card-edit-dropdown">
                            <Dropdown icon="ellipsis vertical">
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => dispatch(showModal('RESOURCE_MODAL', {
                                  resourceName: 'costume_items',
                                  resourceId: costumeItemId,
                                }))}
                                               icon="edit"
                                               text="Edit Costume Item"/>
                                <Dropdown.Item onClick={() => this.handleDestroyCostume(costumeItemId)}
                                               icon="trash"
                                               text="Delete Costume Item"/>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <Image src={costumeItemImageUrl} height={200}/>
                        <Card.Content>
                          <Card.Header>{costumeItem.title}</Card.Header>
                          <Card.Meta>
                            {costumeItem.item_type}
                          </Card.Meta>
                          <Card.Description>
                            {costumeItem.description}
                          </Card.Description>
                        </Card.Content>
                      </Card>
                    )
                  },
                )}
              </Card.Group>
              <Header as='h3' dividing>
                Character Scenes
              </Header>
              <Item.Group divided>
                {Object.keys(groupedCharacterScenes).map(characterId => {
                  characterId = parseInt(characterId)
                  const character = charactersById[characterId]
                  const characterRole = rolesById[character.role_ids[0]]
                  const characterScenes = groupedCharacterScenes[characterId]
                  return (
                    <Item key={characterId}>
                      <Item.Image src={_.get(character, 'display_image.url')}/>

                      <Item.Content>
                        <Item.Header as='a'>{character.name}</Item.Header>
                        <Item.Meta>
                          Played by <a
                          href="#">{`${characterRole.first_name} ${characterRole.last_name}`}</a>
                        </Item.Meta>
                        <Item.Description>
                          <Grid columns={2} divided>
                            <Grid.Column>
                              {character.description}
                            </Grid.Column>
                            <Grid.Column>
                              <h5>Scenes</h5>
                              {characterScenes.map(characterSceneId => {
                                const sceneId = _.find(costume.characters_scenes, {'id': characterSceneId}).scene_id
                                const scene = scenesById[sceneId]
                                return (
                                  <List key={characterSceneId}>
                                    <List.Item>
                                      <Image avatar src={scene.display_image.url}/>
                                      <List.Content>
                                        <List.Header as='a'>{scene.title}</List.Header>
                                        <List.Description>{scene.description}</List.Description>
                                      </List.Content>
                                    </List.Item>
                                  </List>
                                )
                              })}
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
                })}
              </Item.Group>
            </Grid.Column>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default Costume;
