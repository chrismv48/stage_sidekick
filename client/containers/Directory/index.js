const faker = require('faker');
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Layout from "../../components/Layout/index";
import {Button, Grid, Header, Icon, Image, Search, Table} from "semantic-ui-react";
import './Directory.scss'

export class Directory extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    console.log(faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}"));
    const foo = [1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7]
    const departments = ['Costumes', 'Sound', 'Lighting', 'Production', 'Administration']
    const jobTitles = ['Costume Designer', 'Assistant Costume Designer', 'Sound Technician', 'Lighting Technician', 'Director', 'Art Director', 'Scene Design', 'Producer']
    const statuses = ['Full-time Staff', 'Contractor']
    return (
      <Layout thisPage={this.props.route.name}>
        <div className="Directory">
          <Grid className="content-container">
            <Grid.Row>
              <Grid.Column>
                <Header as="h2" dividing>
                  Directory
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column floated="left">
                <div>
                  <Button primary>
                    <Icon name="add user"/>
                    Add User
                  </Button>
                </div>
              </Grid.Column>
              <Grid.Column floated="right" textAlign="right">
                <div>
                  <Search
                    loading={false}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={this.handleSearchChange}
                    value=''
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Table celled padded sortable selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Department</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Phone Number</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {foo.map((_, i) => {
                        return (
                          <Table.Row key={i}>
                            <Table.Cell>
                              <Header as='h4' image>
                                <Image src={faker.fake("{{image.avatar}}")}/>
                                <Header.Content>
                                  {faker.fake("{{name.firstName}} {{name.lastName}}")}
                                  <Header.Subheader>{faker.random.arrayElement(jobTitles)}</Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                            <Table.Cell>{faker.random.arrayElement(departments)}</Table.Cell>
                            <Table.Cell>
                              {faker.random.arrayElement(statuses)}
                            </Table.Cell>
                            <Table.Cell>{faker.fake("{{internet.email}}")}</Table.Cell>
                            <Table.Cell>{faker.fake("{{phone.phoneNumberFormat}}")}</Table.Cell>
                          </Table.Row>
                        )
                      }
                    )}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Directory.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Directory);
