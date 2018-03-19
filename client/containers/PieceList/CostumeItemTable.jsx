import React from 'react';
import './PieceList.scss'
import {Button, Dropdown, Table} from 'semantic-ui-react'
import 'react-table/react-table.css'
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import PropTypes from "prop-types";

const columns = [
  {
    Header: 'Title',
    accessor: 'title'
  },
  {
    Header: 'Description',
    accessor: 'description'
  },
  {
    Header: 'Care Instructions',
    accessor: 'care_instructions'
  },
  {
    Header: 'Source',
    accessor: 'source'
  },
  {
    Header: 'Brand',
    accessor: 'brand'
  },
  {
    Header: 'Notes',
    accessor: 'notes'
  },
  {
    Header: 'Cost',
    accessor: 'cost'
  }
]

@inject("resourceStore", "uiStore") @observer
export class CostumeItemTable extends React.Component {

  render() {
    const { costumeId, resourceStore: {costumes} } = this.props
    const costume = costumes.find(costume => costume.id === costumeId)
    return (
      <Table compact celled definition size='small'>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            {columns.map(column => {
              return (
                <Table.HeaderCell key={column.Header}>{column.Header}</Table.HeaderCell>
              )
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costume.costume_items.map(costumeItem => {
            return (
              <Table.Row key={costumeItem.id}>
                <Table.Cell singleLine textAlign='center'>
                  <div>
                    <Button size='mini' compact primary icon='edit'
                            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
                              resourceName: 'costume_items',
                              resourceId: costumeItem.id
                            })}
                    />
                    <Button size='mini' compact negative icon='remove' onClick={() => costumeItem.destroy()}/>
                  </div>
                </Table.Cell>
                {columns.map(column => {
                  return (
                    <Table.Cell key={column.accessor}>
                      {costumeItem[column.accessor]}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan={columns.length}>
              <Button.Group size='small' floated='right' primary>
                <Dropdown
                  text='Add piece'
                  button
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => this.props.uiStore.showModal(
                        'RESOURCE_MODAL', {resourceName: 'costumes', resourceId: costume.id}
                      )}
                    >
                      Add existing
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.uiStore.showModal(
                      'RESOURCE_MODAL',
                      {resourceName: 'costume_items', resourceId: null, initializeWith: {costume_id: costumeId}}
                    )}
                    >
                      Add new
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Button.Group>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }
}

CostumeItemTable.propTypes = {
  costumeId: PropTypes.number.isRequired
};

export default CostumeItemTable;
