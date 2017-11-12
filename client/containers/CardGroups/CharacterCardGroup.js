import React from 'react';
import {connect} from 'react-redux';
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import {showModal} from "../Modals/actions";
import {deleteResource, fetchResource} from "../../api/actions";
import * as _ from "lodash";
import {Dimmer, Header, Loader} from "semantic-ui-react";

const faker = require('faker');

@connect(state => {
  const {dispatch} = state
  const {
    characters = {},
    roles: {byId: rolesById} = {},
  } = state.resources
  return {
    dispatch,
    characters,
    rolesById,
  }
})

export class CharacterCardGroup extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('characters', 'characters'))
    this.props.dispatch(fetchResource('roles', 'roles'))
  }

  handleDestroyCharacter = (event, characterId) => {
    event.preventDefault()
    this.props.dispatch(deleteResource('character', `characters/${characterId}`))
    this.props.dispatch(fetchResource('characters', 'characters'))
  }

  handleEditCharacter = (event, characterId) => {
    event.preventDefault()
    this.props.dispatch(showModal('RESOURCE_MODAL', {resourceName: 'characters', resourceId: characterId}))
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
    const {byId: charactersById, allIds: charactersAllIds} = this.props.characters
    const {rolesById} = this.props

    if (!charactersById || !rolesById) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }

    return (
      <CardGroup sortable resource='characters'>
        {charactersAllIds.map((characterId, i) => {
          let character = charactersById[characterId]
          const characterImageUrl = character.display_image ? character.display_image.url : null
          const characterRole = _.isEmpty(character.role_ids) ? null : rolesById[character.role_ids[0]]
          return (
            <DisplayCard
              cardImage={characterImageUrl}
              showEditBar
              header={character.name}
              meta={faker.random.arrayElement(['Leading Role', 'Primary Role', 'Supporting Role'])}
              frontDescription={this.generateCardFrontDescription(character, characterRole)}
              extra={this.generateCardExtra(character)}
              onEditCallback={(event) => this.handleEditCharacter(event, characterId)}
              onDeleteCallback={(event) => this.handleDestroyCharacter(event, characterId)}
              label='Character'
              key={`index-${i}`}
              index={i}
              link={`characters/${characterId}`}
            />
            )
          },
        )}
      </CardGroup>
    )
  }
}
