import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Characters.scss'
import {Button, Card, Dimmer, Dropdown, Grid, Header, Image, Loader, Segment} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {deleteResource, fetchResource} from "../../api/actions"
import * as _ from "lodash";
import {arrayMove} from 'react-sortable-hoc'
import {showModal} from "../Modals/actions";
// import img from '../../images/people.jpeg'
const faker = require('faker');

// const SortableCard = SortableElement(({children, ...rest}) => {
//     return (
//       <Card {...rest}>{children}</Card>
//     )
//   }
// );
//
// const SortableCardGroup = SortableContainer(({children, ...rest}) => {
//     return (
//       <Card.Group {...rest}>{children}</Card.Group>
//     )
//   }
// )

@connect(state => {
  const {dispatch} = state
  const {
    characters = {},
    roles: {byId: rolesById} = {}
  } = state.resources
  return {
    dispatch,
    characters,
    rolesById
  }
})

export class Characters extends React.Component {

  state = {
    showModal: false,
    selectedCharacterId: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4']
  }

  componentWillMount() {
    this.props.dispatch(fetchResource('characters', 'characters'))
  }

  handleDestroyCharacter = (characterId) => {
    this.props.dispatch(deleteResource('character', `characters/${characterId}`))
    this.props.dispatch(fetchResource('characters', 'characters'))
  }

  handleOnSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    })
  }

  render() {
    const {loading, byId: charactersById = {}, allIds: charactersAllIds = []} = this.props.characters
    const {dispatch, rolesById} = this.props
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
                <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceType: 'characters', resourceId: null}))} primary>
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
                  <Card.Group itemsPerRow={4}>
                    {charactersAllIds.map((characterId, i) => {
                      let character = charactersById[characterId]
                      const characterImageUrl = character.display_image ? character.display_image.url : null
                      const characterRole = _.isEmpty(character.roles) ? null : rolesById[character.roles[0]]
                        return (
                          <Card raised key={i} className="character-card">
                            <div className="card-edit-panel">
                              <Icon style={{height: "initial"}} name="move"/>
                              <div className="card-edit-dropdown">
                                <Dropdown icon="ellipsis vertical">
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceType: 'characters', resourceId: characterId}))}
                                                   icon="edit"
                                                   text="Edit Character"/>
                                    <Dropdown.Item onClick={() => this.handleDestroyCharacter(characterId)}
                                                   icon="trash"
                                                   text="Delete Character"/>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <Image src={characterImageUrl} height={200} />
                            <Card.Content>
                              <div className={this.state.flipped ? "card-effect" : ""}>
                                <div className="card-front">
                                  <Card.Header>{character.name}</Card.Header>
                                  <Card.Meta>
                                    {faker.random.arrayElement(['Leading Role', 'Primary Role', 'Supporting Role'])}
                                  </Card.Meta>
                                  <Card.Description>
                                    <div className="card-description">
                                      {characterRole &&
                                      <Header as="h5">
                                        Played by <a
                                        href="#">{`${characterRole.first_name} ${characterRole.last_name}`}</a>
                                      </Header>
                                      }
                                      {character.description}
                                    </div>
                                  </Card.Description>
                                </div>
                                <div className="card-back">
                                  Card back
                                </div>
                              </div>
                            </Card.Content>
                            <Card.Content extra>
                              <div style={{textAlign: 'center'}}>
                                <span
                                  onClick={() => this.setState({flipped: !this.state.flipped})}>
                                  {character.scenes && character.scenes.length} Scenes
                                </span>
                              </div>
                            </Card.Content>
                          </Card>
                        )
                      }
                    )}
                  </Card.Group>
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
