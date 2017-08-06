import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";

const faker = require('faker');
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import './Characters.scss'
import {Grid, Container, Header, Card, Image, Table, Segment} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {Link} from "react-router";

export class Characters extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const foo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    return (
      <Layout>
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
                <Card.Group itemsPerRow={4}>
                  {foo.map((_, i) => {
                    let imageStr = `${faker.image.people()}?${faker.random.number({min: 1, max: 1000})}`
                      return (
                        <Card raised key={_}>
                          <Image src={imageStr}/>
                          <Card.Content>
                            <Card.Header>{faker.name.firstName()}</Card.Header>
                            <Card.Meta>
                              {faker.random.arrayElement(['Leading Role', 'Primary Role', 'Supporting Role'])}
                            </Card.Meta>
                            <Card.Description>
                              <div className="card-description">
                                <Header as="h5">
                                  Played by <a href="#">{faker.name.findName()}</a>
                                </Header>
                                {faker.lorem.sentence(12)}
                              </div>
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <div style={{textAlign: 'center'}}>
                              <a href="#">{faker.random.number({min: 1, max: 10})} Scenes</a>
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


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Characters);
