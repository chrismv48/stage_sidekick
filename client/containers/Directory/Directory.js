import {fetchResource} from "../../api/actions";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Layout from "../../components/Layout/index";
import {Button, Grid, Header, Icon, Image, Search, Table} from "semantic-ui-react";
import './Directory.scss'
import {fetchDirectory} from '../../actions'
import {showModal} from "../Modals/actions";

const faker = require('faker');

@connect(state => {
  const {
    dispatch,
    roles = {},
    users: {byId: usersById} = {}
  } = state.resources
  return {
    dispatch,
    roles,
    usersById
  }
})

export class Directory extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(fetchResource('roles', 'roles'))
  }

  render() {
    const {byId: rolesById = {}, allIds: rolesAllIds = []} = this.props.roles
    const {usersById = {}, dispatch} = this.props
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
                  <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceType: 'roles', resourceId: null}))} primary>
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
                    {rolesAllIds.map((roleId, i) => {
                      const role = rolesById[roleId]
                      const user = usersById[role.user_id] || {}
                        return (
                          <Table.Row key={i}>
                            <Table.Cell>
                              <Header as='h4' image>
                                <Image src={role.avatar.url}/>
                                <Header.Content>
                                  {`${role.first_name} ${role.last_name}`}
                                  <Header.Subheader>{role.title}</Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                            <Table.Cell>{role.department}</Table.Cell>
                            <Table.Cell>
                              {role.role_type}
                            </Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.phone_number}</Table.Cell>
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
