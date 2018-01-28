import React from 'react';
import './PieceList.scss'
import {Button, Icon, Table} from 'semantic-ui-react'
import {isEmpty, uniq} from "lodash";
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
          {costumeItemIds.map(costumeItemId => {
            const costumeItem = costume_items.find(costume_item => costume_item.id === costumeItemId)
            return (
              <Table.Row key={costumeItemId}>
                <Table.Cell singleLine textAlign='center'>
                  <div>
                    <Button size='mini' compact primary icon='edit'
                            onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
                              resourceName: 'costume_items',
                              resourceId: costumeItemId
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
                onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {resourceName: 'costume_items', resourceId: null})}
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
