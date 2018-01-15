import React from 'react';
import {inject, observer} from "mobx-react";
import {observable} from 'mobx'
import {Dimmer, Header, Loader} from "semantic-ui-react";
import CardGroup from "components/CardGroup/CardGroup";
import DisplayCard from "components/DisplayCard/DisplayCard";

@inject("resourceStore", "uiStore") @observer
export class CastCardGroup extends React.Component {

  @observable loading = true

  componentDidMount() {
    this.loading = true

    Promise.all([
      this.props.resourceStore.loadActors(),
      this.props.resourceStore.loadCharacters()
    ]).then(() => this.loading = false)
  }

  generateCardFrontDescription = (actor) => {

    const characterTags = actor.character_ids.map(characterId => {
      const character = this.props.resourceStore.characters.find(character => character.id === characterId)
      return (<a key={character.id} href={`characters/${characterId}`}>{character.name}</a>)
    })
    return (
      <div>
        {characterTags.length > 0 &&
        <Header as="h5">
          Plays {characterTags
          .map(characterTag => characterTag)
          .reduce((prev, curr) => [prev, ', ', curr])
        }
        </Header>
        }
        {actor.first_name} graduated from Yale with a BFA in Acting in 2012. Since
        then, {actor.first_name} has starred in various broadway and off-broadway productions including Crucible,
        American Idiot, and Lion King.
      </div>
    )
  }


  handleEditActor = (event, actor) => {
    event.preventDefault()
    this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'actors', resourceId: actor.id})
  }

  handleDestroyActor = (event, actor) => {
    event.preventDefault()
    actor.destroy()
  }

  render() {
    const {actors} = this.props.resourceStore
    if (this.loading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup sortable resource='actors'>
        {actors.map((actor, i) => {
            return (
              <DisplayCard
                cardImage={actor.cardImage}
                showEditBar
                header={actor.fullName}
                frontDescription={this.generateCardFrontDescription(actor)}
                onEditCallback={(event) => this.handleEditActor(event, actor)}
                onDeleteCallback={(event) => this.handleDestroyActor(event, actor)}
                label='Actor'
                key={`index-${i}`}
                sortable={true}
                index={i}
                link={`/cast/${actor.id}`}
              />
            )
          }
        )}
      </CardGroup>
    )
  }
}
