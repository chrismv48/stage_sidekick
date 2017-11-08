import {fetchResource} from "../../api/actions";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Button, Grid, Header, Icon, Image, Search, Table} from "semantic-ui-react";
import './Directory.scss'
import {fetchDirectory} from '../../actions'
import {showModal} from "../Modals/actions";

const faker = require('faker');

@connect(state => {
  const {
    dispatch,
    roles = {},
  } = state.resources
  return {
    dispatch,
    roles,
  }
})

export class Directory extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(fetchResource('roles', 'roles'))
  }

  render() {
    const {byId: rolesById = {}, allIds: rolesAllIds = []} = this.props.roles
    const {dispatch} = this.props
    return (
        <Grid className="Directory">
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
                <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceName: 'roles', resourceId: null}))}
                        primary>
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
                    const user = role.user || {}
                      return (
                        <Table.Row key={i}>
                          <Table.Cell>
                            <Header as='h4'>
                              <Image id='avatar' avatar src={role.display_image.url}/>
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
                    },
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

Directory.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default Directory
