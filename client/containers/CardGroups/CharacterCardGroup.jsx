import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, observable} from 'mobx'
import {Dimmer, Header, Loader} from "semantic-ui-react";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";

const faker = require('faker');

@inject("resourceStore", "uiStore") @observer
export class CharacterCardGroup extends React.Component {

  @computed get characters() {
    const {characterIds, resourceStore} = this.props

    if (characterIds) {
      return resourceStore.characters.filter(character => characterIds.includes(character.id))
    } else {
      return resourceStore.characters
    }
  }

  @observable loading = true

  componentDidMount() {
    this.loading = true

    Promise.all([
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadRoles()
    ]).then(() => this.loading = false)

  }

  handleDestroyCharacter = (event, character) => {
    event.preventDefault()
    character.destroy()
  }

  handleEditCharacter = (event, character) => {
    event.preventDefault()
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'characters', resourceId: character.id})
  }


  generateCardExtra = (character) => {
    return (
      <p onClick={(event) => this.onFlipCard(event, character.id)}
         style={{textAlign: 'center'}}>{`${character.scene_ids && character.scene_ids.length} Scenes`}</p>
    )
  }

  generateCardFrontDescription = (character, characterRole) => {
    return (
      <div>
        {characterRole &&
        <Header as="h5">
          Played by <a
          href="#">{`${characterRole.first_name} ${characterRole.last_name}`}</a>
        </Header>
        }
        {character.description}
      </div>
    )
  }

  render() {
    if (this.loading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup sortable resource='characters'>
        {this.characters.map((character, i) => {
          const characterRole = character.roles.length > 0 ? character.roles[0] : null
          return (
            <DisplayCard
              cardImage={character.main_image}
              showEditBar
              header={character.name}
              meta={faker.random.arrayElement(['Leading Role', 'Primary Role', 'Supporting Role'])}
              frontDescription={this.generateCardFrontDescription(character, characterRole)}
              extra={this.generateCardExtra(character)}
              onEditCallback={(event) => this.handleEditCharacter(event, character)}
              onDeleteCallback={(event) => this.handleDestroyCharacter(event, character)}
              label='Character'
              key={`index-${i}`}
              index={i}
              link={`characters/${character.id}`}
            />
            )
          }
        )}
      </CardGroup>
    )
  }
}
