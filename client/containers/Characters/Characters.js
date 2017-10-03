import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Characters.scss'
import {Button, Card, Dimmer, Grid, Header, Image, List, Loader, Segment} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {deleteResource, fetchResource, swapResourceOrderIndex,} from "../../api/actions"
import * as _ from "lodash";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc'
import {showModal} from "../Modals/actions";
import DisplayCard from "../../components/DisplayCard/DisplayCard";

const faker = require('faker');

const DragHandle = SortableHandle(() => <Icon size='large' style={{height: 'initial', cursor: 'move'}} name="move"
                                              className="card-edit-icon"/>)

const SortableCard = SortableElement(props => {
  return (
    <DisplayCard {...props} />
  )
})

const SortableCardGroup = SortableContainer(({children, ...rest}) => {
  return (
      <Card.Group {...rest}>
        {children}
      </Card.Group>
  )
})

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

  handleOnSortEnd = ({oldIndex, newIndex}) => {
    // const { allIds } = this.props.characters
    // console.log(arrayMove(allIds, oldIndex, newIndex))
    // this.props.dispatch(updateResourceOrderIndex('characters', arrayMove(allIds, oldIndex, newIndex)))
    this.props.dispatch(swapResourceOrderIndex('characters', oldIndex, newIndex))
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
    const {flippedCards, cardOrder = []} = this.state
    return (
      <Layout thisPage={this.props.route.name}>
        <div className="Characters">
          <Grid className="content-container">
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
                  <SortableCardGroup itemsPerRow={4} onSortEnd={this.handleOnSortEnd} axis='xy' useDragHandle={true}>
                    {charactersAllIds.map((characterId, i) => {
                      let character = charactersById[characterId]
                      const characterImageUrl = character.display_image ? character.display_image.url : null
                      const characterRole = _.isEmpty(character.roles) ? null : rolesById[character.roles[0]]
                      return (
                        <SortableCard
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
                          index={character.order_index}
                          link={`characters/${characterId}`}
                          flipped={flippedCards.has(characterId)}
                          renderDragHandle={() => (<DragHandle/>)}
                        />
                        )
                      }
                    )}
                  </SortableCardGroup>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Characters.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default Characters;
