import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Characters.scss'
import {Button, Card, Grid, Header, Image, Modal} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {fetchCharacters} from "../../actions";
import CharacterForm from "../CharacterForm/index";
import * as _ from "lodash";
import {submitCharacterForm} from "../CharacterForm/actions";

const faker = require('faker');

@connect(state => {
  const {dispatch, characters: {characters, loading}, characterForm: {formFields}} = state
  return {
    dispatch,
    characters,
    loading,
    formFields
  }
})


export class Characters extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchCharacters())
  }

  handleCharacterSubmit = () => {
    this.props.dispatch(submitCharacterForm())
  }

  renderCharacterModal = () => (
    <Modal trigger={<Button primary>
      <Icon name='add user'/>
      Add Character
    </Button>} closeIcon='close'>
      <Header icon='add user' content='Add New Character'/>
      <Modal.Content>
        <CharacterForm/>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={this.handleCharacterSubmit} disabled={_.isEmpty(this.props.formFields)}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  )

  render() {
    const {loading, characters} = this.props
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
                {this.renderCharacterModal()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Card.Group itemsPerRow={4}>
                  {characters.map((character, i) => {
                      let imageStr = `${faker.image.people()}?${faker.random.number({min: 1, max: 1000})}`
                      return (
                        <Card raised key={i}>
                          <Image src={imageStr}/>
                          <Card.Content>
                            <Card.Header>{character.name}</Card.Header>
                            <Card.Meta>
                              {faker.random.arrayElement(['Leading Role', 'Primary Role', 'Supporting Role'])}
                            </Card.Meta>
                            <Card.Description>
                              <div className="card-description">
                                <Header as="h5">
                                  Played by <a
                                  href="#">{`${character.roles[0].first_name} ${character.roles[0].last_name}`}</a>
                                </Header>
                                {character.description}
                              </div>
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <div style={{textAlign: 'center'}}>
                              <a href="#">{character.scenes.length} Scenes</a>
                            </div>
                          </Card.Content>
                        </Card>
                      )
                    }
                  )}
                </Card.Group>
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
