import React from 'react';
import './Actor.scss'
import {Grid, Header, Image, List, Tab,} from 'semantic-ui-react'
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {capitalize, replace} from 'lodash'
import {CharacterCardGroup} from "containers/CardGroups/CharacterCardGroup";
import {EditableField} from "components/EditableField/EditableField";
import EditIcon from "components/EditIcon/EditIcon";
import ImgLightbox from "components/ImgLightbox/ImgLightbox";
import {CostumeCardGroup} from "containers/CardGroups/CostumeCardGroup";
import ContentLoader from "components/ContentLoader/ContentLoader";
import ActorModel from 'models/actorModel'

@inject("resourceStore", "uiStore") @observer
export class Actor extends React.Component {

  @observable loading = true
  @observable showLightbox = false

  @computed get actorId() {
    return parseInt(this.props.actorId || this.props.match.params.actorId)
  }

  @computed get actor() {
    return this.props.resourceStore.actors.find(actor => actor.id === this.actorId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadActors(this.actorId),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
    ]).then(() => this.loading = false)
  }

  @computed get renderActivitySection() {
    const panes = [
      {menuItem: 'Comments', render: () => <Tab.Pane><CommentFeed resource='actors' resourceId={this.actorId} comments={this.actor.comments}/></Tab.Pane>},
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
          resourceName: 'actors',
          resourceId: this.actor.id
        })}>
        Click to add
      </p>
    )
  }


  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    return (
      <Grid className="Actor">
        <Grid.Column>
            <Image
              src={this.actor.primaryImage}
              onClick={() => this.showLightbox = true}
              size='medium'
              className='header-image'
            />
          <a
            className='edit-images-link'
            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
              resourceName: 'actors',
              resourceId: this.actor.id
            })}
          >
            Edit
          </a>
            <ImgLightbox
              images={this.actor.images.toJS()}
              isOpen={this.showLightbox}
              handleOnClose={() => this.showLightbox = false}
            />
            <Header as="h1">
            {this.actor.fullName}
          </Header>
          <Header as='h3' dividing>
            Description
          </Header>
          <EditableField resource={'actors'} resourceId={this.actorId} field={'description'} fieldType='textarea'/>
          <Header as='h3' dividing>
            Profile / Measurements
          </Header>
          <div className='profile-measurements-container'>
            <div className='profile-container'>
              <Header as='h5'>Profile</Header>
              <List verticalAlign='middle'>
                {ActorModel.profileFields.map((profileField, i) => {
                  const field = this.actor.formFields.find(field => field.field === profileField)
                  return(
                    <List.Item key={`profile-${i}`} className='actor-list-item'>
                    <List.Content floated='right'>
                      <div className='field-container'>
                        <EditableField resource={'actors'} resourceId={this.actorId} field={field.field} fieldType={field.inputType}/>
                      </div>
                    </List.Content>
                    <List.Content>{field.label || capitalize(replace(field.field, /_/g, ' '))}</List.Content>
                  </List.Item>
                  )}
                )}
              </List>
            </div>
            <div className='measurements-container'>
              <Header as='h5'>Measurements</Header>
              <List verticalAlign='middle'>
                {ActorModel.measurementFields.map((measurementField, i) => {
                  const field = this.actor.formFields.find(field => field.field === measurementField)
                  return (
                    <List.Item key={`measurement-${i}`} className='actor-list-item'>
                      <List.Content floated='right'>
                        <div className='field-container'>
                          <EditableField resource={'actors'} resourceId={this.actorId} field={field.field} fieldType={field.inputType}/>
                        </div>
                      </List.Content>
                      <List.Content>{field.label || capitalize(replace(field.field, /_/g, ' '))}</List.Content>
                    </List.Item>
                  )}
                )}
              </List>
            </div>
          </div>

          <Header as='h3' dividing>
            Characters
            {this.actor.characterIds.length > 0 &&
            <span style={{float:'right'}}>
              <EditIcon resource='actors' resourceId={this.actorId} />
            </span>
            }
          </Header>
          {this.actor.characterIds.length > 0 ?
            <CharacterCardGroup characterIds={this.actor.characterIds}/>
            : this.renderEmptyContent()
          }
          {this.actor.costumeIds.length > 0 &&
          <React.Fragment>
            <Header as='h3' dividing>
              Costumes
            </Header>
            <CostumeCardGroup costumeIds={this.actor.characterIds}/>
          </React.Fragment>
          }

          <Header as='h3' dividing>
            Activity
          </Header>
          {this.renderActivitySection}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Actor;
