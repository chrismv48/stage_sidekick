import React from 'react';
import {connect} from 'react-redux';
import './Costume.scss'
import {Dimmer, Grid, Header, Image, Item, Label, List, Loader, Tab,} from 'semantic-ui-react'
import {fetchResource} from "../../api/actions"
import * as _ from "lodash";
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import CommentFeed from "../../components/CommentFeed/CommentFeed";

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

  renderActivitySection() {
    const panes = [
      {menuItem: 'Comments', render: () => <Tab.Pane><CommentFeed/></Tab.Pane>},
      {menuItem: 'Activity', render: () => <Tab.Pane><ActivityFeed/></Tab.Pane>},
    ]

    return (
      <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
    )
  }

  render() {
    const { costume, charactersById, rolesById, scenesById, costumeItemsAllIds, costumeItemsById, dispatch } = this.props
    if (!charactersById || !rolesById || !scenesById || !costume || !costumeItemsById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }
    const groupedCharacterScenes = this.groupCharacterScenes()
    return (
      <Grid className="Costume">
        <Grid.Column>
          <Header as="h1">
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

          <CardGroup resource={'costume_items'}>
            {costume.costume_item_ids.map((costumeItemId, i) => {
                let costumeItem = costumeItemsById[costumeItemId]
                const costumeItemImageUrl = costumeItem.display_image ? costumeItem.display_image.url : null
                return (
                  <DisplayCard
                    cardImage={costumeItemImageUrl}
                    header={costumeItem.title}
                    meta={costumeItem.item_type}
                    frontDescription={costumeItem.description}
                    label='Costume Item'
                    key={`index-${i}`}
                    sortable={false}
                    index={i}
                  />
                )
              },
            )}
          </CardGroup>
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

          <Header as='h3' dividing>
            Activity
          </Header>
          {this.renderActivitySection()}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Costume;
