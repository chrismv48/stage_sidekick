import React from 'react';
import './Character.scss'
import {Dimmer, Grid, Header, Image, Loader, Segment, Tab,} from 'semantic-ui-react'
import {get, isEmpty} from "lodash";
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react/index";
import {EditableField} from "components/EditableField/EditableField";
import EditIcon from "components/EditIcon/EditIcon";
import {SceneCardGroup} from "containers/CardGroups/SceneCardGroup";

@inject("resourceStore", "uiStore") @observer
export class Character extends React.Component {

  @observable loading = true

  @computed get characterId() {
    return parseInt(this.props.match.params.characterId)
  }

  @computed get character() {
    return this.props.resourceStore.characters.find(character => character.id === this.characterId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCharacters(this.costumeId),
      this.props.resourceStore.loadScenes(),
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
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }


    const characterRole = isEmpty(this.character.role_ids) ? {} : roles.find(role => role.id === this.character.role_ids[0])

    return (
      <Grid className="this.character">
        <Grid.Column className="this.character">
          <Header as="h1">
            <Image shape='circular' src={this.character.primary_image}/>
            {' '}{this.character.name}
            <Header.Subheader>
              Played by <a href="#">{`${characterRole.first_name} ${characterRole.last_name}`}</a>
            </Header.Subheader>
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <EditableField resource='characters' resourceId={this.characterId} field='description' fieldType='textarea'/>

          <Header as='h3' dividing>
            Scenes
            {this.character.scene_ids.length > 0 &&
            <span style={{float: 'right'}}>
              <EditIcon resource='characters' resourceId={this.characterId}/>
            </span>
            }
          </Header>
          {this.character.scene_ids.length > 0 ?
            <SceneCardGroup sceneIds={this.character.scene_ids}/>
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
