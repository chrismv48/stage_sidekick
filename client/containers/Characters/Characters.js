import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Characters.scss'
import {Button, Dimmer, Grid, Header, Image, List, Loader, Segment} from 'semantic-ui-react'
import {deleteResource, fetchResource} from "../../api/actions"
import * as _ from "lodash";
import {showModal} from "../Modals/actions";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import CardGroup from "../../components/CardGroup/CardGroup";

const faker = require('faker');

@connect(state => {
  const {dispatch} = state
  const {
    characters = {},
    roles: {byId: rolesById} = {},
    scenes: {byId: scenesById = {}} = {},
  } = state.resources
  return {
    dispatch,
    characters,
    rolesById,
    scenesById,
  }
})

export class Characters extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      selectedCharacterId: null,
      flippedCards: new Set(),
    }
  }

  componentWillMount() {
    this.props.dispatch(fetchResource('characters', 'characters'))
    this.props.dispatch(fetchResource('scenes', 'scenes'))
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

  onSortButton = (direction, field) => {
    const {allIds, byId} = this.props.characters
    _.orderBy([field], direction, Object.values(byId))
  }

  onFlipCard = (event, characterId) => {
    event.preventDefault()
    let newFlippedCards = Object.assign(this.state.flippedCards, new Set)
    if (!newFlippedCards.delete(characterId)) {
      newFlippedCards.add(characterId)
    }
    this.setState({flippedCards: newFlippedCards})
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

  generateCardBackDescription = (character) => {
    if (!character) {
      return
    }
    const scenes = this.props.scenesById
    return (
      <List>
        {character.scene_ids.map(sceneId => {
          const scene = scenes[sceneId]
          return (
            <List.Item key={sceneId}>
              <Image avatar verticalAlign='middle' src={scene.display_image.url}/>
              <List.Content verticalAlign='middle'>
                <List.Description>{scene.title}</List.Description>
              </List.Content>
            </List.Item>
          )
        })
        }
      </List>
    )
  }

  render() {
    const {loading, byId: charactersById = {}, allIds: charactersAllIds = []} = this.props.characters
    const {dispatch, rolesById} = this.props
    const {flippedCards} = this.state
    return (
      <Grid className="characters">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Characters
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceName: 'characters', resourceId: null}))} primary>
              <Icon name='add user'/>
              Add Character
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment basic style={{padding: 0}}>
              <Dimmer active={loading} inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
              <CardGroup sortable={true} itemsPerRow={4} resource='characters'>
                {charactersAllIds.map((characterId, i) => {
                  let character = charactersById[characterId]
                  const characterImageUrl = character.display_image ? character.display_image.url : null
                  const characterRole = _.isEmpty(character.roles) ? null : rolesById[character.roles[0]]
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
                      flipped={flippedCards.has(characterId)}
                    />
                    )
                  }
                )}
              </CardGroup>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Characters.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default Characters;
