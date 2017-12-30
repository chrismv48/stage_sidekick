import React from 'react';
import './Costume.scss'
import {Dimmer, Grid, Header, Image, Item, Label, List, Loader, Segment, Tab,} from 'semantic-ui-react'
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {find, get} from 'lodash'

@inject("resourceStore", "uiStore") @observer
export class Costume extends React.Component {

  @observable loading = true

  @computed get costumeId() {
    return parseInt(this.props.match.params.costumeId)
  }

  @computed get costume() {
    return this.props.resourceStore.costumes.find(costume => costume.id === this.costumeId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCostumes(this.costumeId),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadRoles(),
      this.props.resourceStore.loadCostumeItems(),
    ]).then(() => this.loading = false)
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
    const { costume_items, characters, scenes, roles } = this.props.resourceStore
    if (this.loading) {
      return (
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }

    return (
      <Grid className="Costume">
        <Grid.Column>
          <Header as="h1">
            <Image shape='circular' src={get(this.costume, 'display_image.url')}/>
            {this.costume.title}
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <p>
            {this.costume.description}
          </p>
          <Header as='h3' dividing>
            Costume Items
          </Header>

          <CardGroup resource={'costume_items'}>
            {this.costume.costume_item_ids.map((costumeItemId, i) => {
                let costumeItem = costume_items.find(costume_item => costume_item.id === this.costume.id)
                return (
                  <DisplayCard
                    cardImage={costumeItem.main_image}
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
            {Object.keys(this.costume.characterScenesByCharacter).map(characterId => {
              characterId = parseInt(characterId)
              const character = characters.find(character => character.id === characterId)
              const characterRole = roles.find(role => role.id === character.role_ids[0])
              const characterSceneIds = this.costume.characterScenesByCharacter[characterId]
              return (
                <Item key={characterId}>
                  <Item.Image src={get(character, 'display_image.url')}/>
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
                          {characterSceneIds.map(characterSceneId => {
                            const sceneId = find(this.costume.characters_scenes, {'id': characterSceneId}).scene_id
                            const scene = scenes.find(scene => scene.id === sceneId)
                            const sceneImageUrl = scene.display_image ? scene.display_image.url : null
                            return (
                              <List key={characterSceneId}>
                                <List.Item>
                                  <Image avatar src={sceneImageUrl}/>
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
