import React from 'react';
import './Scene.scss'
import {Dimmer, Grid, Header, Image, Loader, Segment, Tab,} from 'semantic-ui-react'
import {get} from "lodash";
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react/index";
import EditIcon from "components/EditIcon/EditIcon";
import {CharacterCardGroup} from "containers/CardGroups/CharacterCardGroup";
import {EditableField} from "components/EditableField/EditableField";
import ImgLightbox from "../../components/ImgLightbox/ImgLightbox";

@inject("resourceStore", "uiStore") @observer
export class Scene extends React.Component {

  @observable loading = true
  @observable showLightbox = false

  @computed get sceneId() {
    return parseInt(this.props.match.params.sceneId)
  }

  @computed get scene() {
    return this.props.resourceStore.scenes.find(scene => scene.id === this.sceneId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadScenes(this.sceneId),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadRoles(),
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
          resourceName: 'scenes',
          resourceId: this.sceneId
        })}>
        Click to add
      </p>
    )
  }

  render() {
    const {characters, roles} = this.props.resourceStore
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
      <Grid className='Scene'>
        <Grid.Column>
          <Image
            src={this.scene.primary_image}
            onClick={() => this.showLightbox = true}
            size={'large'}
            className='header-image'
          />
          <a
            className='edit-images-link'
            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
              resourceName: 'scenes',
              resourceId: this.scene.id
            })}
          >
            Edit
          </a>
          <ImgLightbox
            images={this.scene.images.toJS()}
            isOpen={this.showLightbox}
            handleOnClose={() => this.showLightbox = false}
          />
          <Header as="h1">
            {this.scene.title}
          <Header.Subheader>
            {this.scene.setting}, {this.scene.length_in_minutes}m runtime
          </Header.Subheader>
          </Header>

        <Header as='h3' dividing>
          Description
        </Header>
        <EditableField resource='scenes' resourceId={this.sceneId} field='description' fieldType='textarea'/>

        <Header as='h3' dividing>
          Characters
          {this.scene.character_ids.length > 0 &&
          <span style={{float:'right'}}>
              <EditIcon resource='scenes' resourceId={this.sceneId} />
            </span>
          }
        </Header>
        {this.scene.character_ids.length > 0 ?
          <CharacterCardGroup characterIds={this.scene.character_ids}/>
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

export default Scene;
