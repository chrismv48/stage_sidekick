const faker = require('faker');
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Layout from "../../components/Layout/index";
import {Button, Grid, Header, Icon, Image, Search, Table} from "semantic-ui-react";
import './Directory.scss'
import {fetchDirectory} from '../../actions'

@connect(state => {
  const {dispatch, directory: {staff, loading}} = state
  return {
    dispatch,
    staff,
    loading
  }
})

export class Directory extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(fetchDirectory())
  }

  render() {
    const {staff, loading} = this.props
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
                    {!loading && staff.map((member, i) => {
                        return (
                          <Table.Row key={i}>
                            <Table.Cell>
                              <Header as='h4' image>
                                <Image src={faker.fake("{{image.avatar}}")}/>
                                <Header.Content>
                                  {`${member.first_name} ${member.last_name}`}
                                  <Header.Subheader>{member.title}</Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                            <Table.Cell>{member.department}</Table.Cell>
                            <Table.Cell>
                              {member.role_type}
                            </Table.Cell>
                            <Table.Cell>{member.email}</Table.Cell>
                            <Table.Cell>{member.phone_number}</Table.Cell>
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

export default Directory
