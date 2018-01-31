import React from 'react';
import './PieceList.scss'
import {Button, Icon, Table} from 'semantic-ui-react'
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
    const { costumeItemIds, resourceStore: {costume_items} } = this.props
    const costumeItems = costume_items.filter(costume_item => costumeItemIds.includes(costume_item.id))
    const costumeId = costumeItems.length > 0 ? costumeItems[0].costume_id : null
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
          {costumeItems.map(costumeItem => {
            return (
              <Table.Row key={costumeItem}>
                <Table.Cell singleLine textAlign='center'>
                  <div>
                    <Button size='mini' compact primary icon='edit'
                            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
                              resourceName: 'costume_items',
                              resourceId: costumeItem
                            })}
                    />
                  <Button size='mini' compact negative icon='remove' onClick={() => costumeItem.destroy()} />
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
              <Button
                floated='right'
                icon
                labelPosition='left'
                primary
                size='small'
                onClick={() => this.props.uiStore.showModal(
                  'RESOURCE_MODAL',
                  {resourceName: 'costume_items', resourceId: null, initializeWith: {costume_id: costumeId}}
                )}
              >
                <Icon name='add' /> Add piece
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }
}

CostumeItemTable.propTypes = {
  costumeItemIds: PropTypes.array.isRequired
};

export default CostumeItemTable;
