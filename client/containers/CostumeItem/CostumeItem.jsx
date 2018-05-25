import React from 'react';
import './CostumeItem.scss'
import {Form, Header, Image, Tab,} from 'semantic-ui-react'
import CardGroup from "components/CardGroup/CardGroup";
import ActivityFeed from "components/ActivityFeed/ActivityFeed";
import CommentFeed from "components/CommentFeed/CommentFeed";
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import {EditableField} from "components/EditableField/EditableField";
import EditIcon from "components/EditIcon/EditIcon";
import ImgLightbox from "components/ImgLightbox/ImgLightbox";
import ContentLoader from "components/ContentLoader/ContentLoader";
import {CostumeCardGroup} from "../CardGroups/CostumeCardGroup";

@inject("resourceStore", "uiStore") @observer
export class CostumeItem extends React.Component {

  @observable loading = true
  @observable showLightbox = false

  @computed get costumeItemId() {
    return this.props.costumeItemId || parseInt(this.props.match.params.costumeItemId)
  }

  @computed get costumeItem() {
    return this.props.resourceStore.costume_items.find(costumeItem => costumeItem.id === this.costumeItemId)
  }

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCostumeItems(this.costumeItemId),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadRoles(),
      this.props.resourceStore.loadCostumes(),
    ]).then(() => this.loading = false)
  }

  renderActivitySection() {
    const panes = [
      {
        menuItem: 'Comments',
        render: () => <Tab.Pane><CommentFeed resource='costume_items' resourceId={this.costumeItemId}
                                             comments={this.costumeItem.comments}/></Tab.Pane>
      },
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
    const {costumes, characters, scenes, roles} = this.props.resourceStore
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    return (
      <div className="Costume main-content">
        <Image
          src={this.costumeItem.primaryImage}
          onClick={() => this.showLightbox = true}
          size='medium'
          className='header-image'
        />
        <a
          className='edit-images-link'
          onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
            resourceName: 'costumes',
            resourceId: this.costumeItem.id
          })}
        >
          Edit
        </a>
        <ImgLightbox
          images={this.costumeItem.images.toJS()}
          isOpen={this.showLightbox}
          handleOnClose={() => this.showLightbox = false}
        />
        <Header as="h1">
          {this.costumeItem.title}
        </Header>

        <Header as='h3' dividing>
          Description
        </Header>
        <EditableField resource='costume_items' resourceId={this.costumeItemId} field='description'
                       fieldType='textarea'/>

        <Header as='h3' dividing>
          Details
        </Header>
        <Form>
          <Form.Field>
            <label>Item Type</label>
            <EditableField
              resource='costume_items'
              resourceId={this.costumeItemId}
              field='item_type'
              fieldType='dropdown'
              dropdownOptions={{options: this.costumeItem.constructor.itemTypeDropdownOptions}}
            />
          </Form.Field>

          <Form.Field width={4}>
            <label>Source</label>
            <EditableField
              resource='costume_items'
              resourceId={this.costumeItemId}
              field='source'
              fieldType='text'
            />
          </Form.Field>

          <Form.Field width={4}>
            <label>Brand</label>
            <EditableField
              resource='costume_items'
              resourceId={this.costumeItemId}
              field='brand'
              fieldType='text'
            />
          </Form.Field>

          <Form.Field width={2}>
            <label>Cost</label>
            <EditableField
              resource='costume_items'
              resourceId={this.costumeItemId}
              field='cost'
              fieldType='text'
            />
          </Form.Field>

          <Form.Field width={8}>
            <label>Care Instructions</label>
            <EditableField
              resource='costume_items'
              resourceId={this.costumeItemId}
              field='care_instructions'
              fieldType='textarea'
            />
          </Form.Field>
        </Form>

        <Header as='h3' dividing>
          Costumes
          <span style={{float: 'right'}}>
            <EditIcon resource='costume_items' resourceId={this.costumeItemId}/>
          </span>
        </Header>
        <CardGroup resource='costumes'>
          {this.costumeItem.costume ?
            <CostumeCardGroup costumeIds={[this.costumeItem.costume_id]}/>
            : this.renderEmptyContent()
          }
        </CardGroup>

        <Header as='h3' dividing>
          Activity
        </Header>
        {this.renderActivitySection()}
      </div>
    );
  }
}

export default CostumeItem;
