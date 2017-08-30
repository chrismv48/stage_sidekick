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
    characters = {}
  } = state.entities
  return {
    dispatch,
    characters
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

  componentWillReceiveProps(nextProps) {
    // If characters change, indicates that it was modified/created
    // if (this.props.character.success && this.props.character.formFields) {
    //   this.setState({showModal: false})
    //   this.props.dispatch(fetchResource('characters', 'characters'))
    // }
  }

  showCreateCharacterModal = () => {
    this.setState({selectedCharacterId: null, showModal: true})
  }

  showEditCharacterModal = (characterId) => {
    this.setState({selectedCharacterId: characterId, showModal: true})
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
    const { dispatch } = this.props
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
                <Button onClick={() => dispatch(showModal('CHARACTER_MODAL', {characterId: null}))} primary>
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
                        let imageStr = `${faker.image.people()}?${faker.random.number({min: 1, max: 1000})}`
                        let character = charactersById[characterId]
                        return (
                          <Card raised key={i} className="character-card">
                            <div className="card-edit-panel">
                              <Icon style={{height: "initial"}} name="move"/>
                              <div className="card-edit-dropdown">
                                <Dropdown icon="ellipsis vertical">
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => dispatch(showModal('CHARACTER_MODAL', {characterId}))}
                                                   icon="edit"
                                                   text="Edit Character"/>
                                    <Dropdown.Item onClick={() => this.handleDestroyCharacter(characterId)}
                                                   icon="trash"
                                                   text="Delete Character"/>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <Image src={imageStr}/>
                            <Card.Content>
                              <div className={this.state.flipped ? "card-effect" : ""}>
                                <div className="card-front">
                                  <Card.Header>{character.name}</Card.Header>
                                  <Card.Meta>
                                    {faker.random.arrayElement(['Leading Role', 'Primary Role', 'Supporting Role'])}
                                  </Card.Meta>
                                  <Card.Description>
                                    <div className="card-description">
                                      {!_.isEmpty(character.roles) &&
                                      <Header as="h5">
                                        Played by <a
                                        href="#">{`${character.roles[0].first_name} ${character.roles[0].last_name}`}</a>
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
                                  {character.scenes.length} Scenes
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
