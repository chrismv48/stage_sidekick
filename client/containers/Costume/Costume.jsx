import React from 'react';
import './Costume.scss'
import {Grid, Header, Image, Item, Label, List, Tab,} from 'semantic-ui-react'
import CardGroup from "components/CardGroup/CardGroup";
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {EditableField} from "../../components/EditableField/EditableField";
import EditIcon from "../../components/EditIcon/EditIcon";
import {CostumeItemCardGroup} from "../CardGroups/CostumeItemCardGroup";
import ImgLightbox from "../../components/ImgLightbox/ImgLightbox";
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class Costume extends React.Component {

  @observable loading = true
  @observable showLightbox = false

  @computed get costumeId() {
    return this.props.costumeId || parseInt(this.props.match.params.costumeId)
  }

  @computed get costume() {
    return this.props.resourceStore.costumes.find(costume => costume.id === this.costumeId)
  }

  // Returns hash {character: [scenes]}
  @computed get scenesByCharacter() {
    let groupedCharacterScenes = {}
    for (let costumeCharacterScene of this.costume.costumes_characters_scenes) {
      const {scene_id: sceneId, character_id: characterId} = costumeCharacterScene
      if (characterId in groupedCharacterScenes) {
        groupedCharacterScenes[characterId].push(sceneId)
      }
      else {
        groupedCharacterScenes[characterId] = sceneId ? [sceneId] : []
      }
    }
    return groupedCharacterScenes
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

  renderEmptyContent() {
    return (
      <p
        className='empty-field'
        onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
          resourceName: 'characters',
          resourceId: this.characterId
        })}>
        Click to add
      </p>
    )
  }


  render() {
    const { costume_items, characters, scenes, roles } = this.props.resourceStore
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    return (
      <Grid className="Costume">
        <Grid.Column>
          <Image
            src={this.costume.primaryImage}
            onClick={() => this.showLightbox = true}
            size='medium'
            className='header-image'
          />
          <a
            className='edit-images-link'
            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
              resourceName: 'costumes',
              resourceId: this.costume.id
            })}
          >
            Edit
          </a>
          <ImgLightbox
            images={this.costume.images.toJS()}
            isOpen={this.showLightbox}
            handleOnClose={() => this.showLightbox = false}
          />
          <Header as="h1">
            {this.costume.title}
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <EditableField resource='costumes' resourceId={this.costumeId} field='description' fieldType='textarea'/>
          <Header as='h3' dividing>
            Costume Items
            {this.costume.costumeItemIds.length > 0 &&
            <span style={{float: 'right'}}>
              <EditIcon resource='costumes' resourceId={this.costumeId}/>
            </span>
            }
          </Header>

          <CardGroup resource={'costume_items'}>
            {this.costume.costumeItemIds.length > 0 ?
              <CostumeItemCardGroup costumeItemIds={this.costume.costumeItemIds}/>
              : this.renderEmptyContent()
            }
          </CardGroup>
          <Header as='h3' dividing>
            Character Scenes
            {this.scenesByCharacter.length > 0 &&
            <span style={{float: 'right'}}>
              <EditIcon resource='costumes' resourceId={this.costumeId}/>
            </span>
            }
          </Header>
          <Item.Group divided>
            {this.scenesByCharacter.length > 0 && this.renderEmptyContent()}

            {Object.keys(this.scenesByCharacter).map(characterId => {
              characterId = parseInt(characterId)
              const character = characters.find(character => character.id === characterId)
              const characterRole = roles.find(role => role.id === character.actorIds[0])
              const sceneIds = this.scenesByCharacter[characterId]
              return (
                <Item key={characterId}>
                  <Item.Image src={character.cardImage}/>
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
                          {sceneIds.map(sceneId => {
                            const scene = scenes.find(scene => scene.id === sceneId)
                            return (
                              <List key={sceneId}>
                                <List.Item>
                                  <Image avatar src={scene.cardImage}/>
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
