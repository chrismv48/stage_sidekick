import React from 'react';
import './Character.scss'
import {Grid, Header, Image, Tab,} from 'semantic-ui-react'
import {isEmpty} from "lodash";
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react/index";
import {EditableField} from "components/EditableField/EditableField";
import EditIcon from "components/EditIcon/EditIcon";
import {SceneCardGroup} from "containers/CardGroups/SceneCardGroup";
import ImgLightbox from "components/ImgLightbox/ImgLightbox";
import ContentLoader from "components/ContentLoader/ContentLoader";
import {Link} from "react-router-dom";

@inject("resourceStore", "uiStore") @observer
export class Character extends React.Component {

  @observable loading = true
  @observable showLightbox = false

  @computed get characterId() {
    return parseInt(this.props.match.params.characterId)
  }

  @computed get character() {
    return this.props.resourceStore.characters.find(character => character.id === this.characterId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCharacters(this.costumeItemId),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadRoles(),
    ]).then(() => this.loading = false)
  }

  renderActivitySection() {
    const panes = [
      {menuItem: 'Comments', render: () => <Tab.Pane><CommentFeed resource='characters' resourceId={this.characterId} comments={this.character.comments}/></Tab.Pane>},
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
    const {roles, scenes} = this.props.resourceStore
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    const characterRole = isEmpty(this.character.actorIds) ? {} : roles.find(role => role.id === this.character.actorIds[0])

    return (
      <Grid className="Character">
        <Grid.Column>
          <Image
            src={this.character.primaryImage}
            onClick={() => this.showLightbox = true}
            size='medium'
            className='header-image'
          />
          <a
            className='edit-images-link'
            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
              resourceName: 'characters',
              resourceId: this.character.id
            })}
          >
            Edit
          </a>
          <ImgLightbox
            images={this.character.images.toJS()}
            isOpen={this.showLightbox}
            handleOnClose={() => this.showLightbox = false}
          />
          <Header as="h1">
            {this.character.name}
            <Header.Subheader>
              Played by <Link to={`/cast/${characterRole.id}`}>{`${characterRole.first_name} ${characterRole.last_name}`}</Link>
            </Header.Subheader>
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <EditableField resource='characters' resourceId={this.characterId} field='description' fieldType='textarea'/>

          <Header as='h3' dividing>
            Scenes
            {this.character.sceneIds.length > 0 &&
            <span style={{float: 'right'}}>
              <EditIcon resource='characters' resourceId={this.characterId}/>
            </span>
            }
          </Header>
          {this.character.sceneIds.length > 0 ?
            <SceneCardGroup sceneIds={this.character.sceneIds}/>
            : this.renderEmptyContent()
          }
          <Header as='h3' dividing>
            Activity
          </Header>
          {this.renderActivitySection()}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Character;
