import React from 'react';
import './ResourceTable.scss'
import {Checkbox, Dropdown, header, Icon, Table} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, isObservableArray, observable} from "mobx";
import PropTypes from 'prop-types'
import {get, intersection, isEmpty, orderBy} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";
import {pluralizeResource} from "../../../helpers";

@inject("resourceStore", "uiStore") @observer
export class ResourceTable extends React.Component {

  @observable loading = true

  @observable sortDirection = null
  @observable sortColumn = null

  @observable hiddenColumns = []

  @observable showColumnDropdown = false

  @observable activeFilters = new Map()

  @computed get model() {
    const {resourceStore: {resources}, resource} = this.props
    return resources[resource]
  }

  @computed get rows() {
    const {resource} = this.props
    return this.props.resourceStore[resource]
  }

  @computed get columns() {
    // Since tableColumns is an instance method of the resource model.
    return (this.rows.length === 0 || this.loading) ? [] : this.rows[0].tableData
  }

  @computed get visibleColumns() {
    return this.columns.filter(col => !this.hiddenColumns.includes(col.field))
  }

  set rows(value) {
    const {resource} = this.props
    this.props.resourceStore[resource] = value
  }

  @computed get abbreviatedSortDirection() {
    return this.sortDirection && this.sortDirection === 'ascending' ? 'asc' : 'desc'
  }

  @computed get visibleRows() {
    return this.rows.filter(row => {
      return this.activeFilters.entries().map(([field, filteredValue]) => {

        // just convert everything into an array so we can do a single comparison statement
        filteredValue = isObservableArray(filteredValue) ? filteredValue : [filteredValue]
        let rowValue = isObservableArray(row[field]) ? row[field] : [row[field]]
        return !isEmpty(intersection(filteredValue, rowValue))
      }).every(condition => condition)
    })
  }

  initializeDefaultFilters() {
    for (let col of this.columns.filter(col => col.filterOptions)) {
      if (col['filterOptions']['defaultValue']) {
        this.activeFilters.set(col.field, col['filterOptions']['defaultValue'])
      }
    }
  }

  initializeHiddenColumns() {
    this.hiddenColumns = this.columns.filter(col => col.defaultVisible === false).map(col => col.field)
  }

  toggleColumnVisibility = (columnName) => {
    if (this.hiddenColumns.includes(columnName)) {
      this.hiddenColumns = this.hiddenColumns.filter(col => col !== columnName)
    } else {
      this.hiddenColumns.push(columnName)
    }
  }

  handleSort(sortKey) {
    this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
    this.sortColumn = sortKey
    this.rows = orderBy(this.rows, sortKey, this.abbreviatedSortDirection)
  }

  renderCell(column, row) {
    if (column.renderCell) {
      return column.renderCell
    } else {
      return get(row, column.field)
    }
  }

  handleFilterChange(field, value) {
    if (!value || value.length === 0) {
      this.activeFilters.delete(field)
    } else {
      this.activeFilters.set(field, value)
    }
  }

  componentDidMount() {
    const {resource} = this.props
    this.loading = true
    const loadRelationships = Object.keys(this.model.RELATIONSHIPS).map(relationship => this.props.resourceStore.loadResource(pluralizeResource(relationship)))
    loadRelationships.push(this.props.resourceStore.loadResource(pluralizeResource(resource)))
    Promise.all(loadRelationships).then(() => {
      this.loading = false
      this.initializeHiddenColumns()
      this.initializeDefaultFilters()
    })
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    const {showResourceSidebar} = this.props.uiStore
    const {resource} = this.props
    return (
      <div className='ResourceTable'>
        <div className='filters-container'>
          <div className='column-picker filter-item'>
            <Dropdown
              text='Columns'
              open={this.showColumnDropdown}
              onClick={() => this.showColumnDropdown = true}
              onBlur={() => this.showColumnDropdown = false}
            >
              <Dropdown.Menu>
                <Dropdown.Header content='Display columns'/>
                <Dropdown.Divider/>
                {this.columns.map(column =>
                  <Dropdown.Item key={column.header}>
                    <Checkbox
                      label={column.header}
                      checked={!this.hiddenColumns.includes(column.field)}
                      onChange={() => this.toggleColumnVisibility(column.field)}
                    />
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {this.columns.map(column => {
            if (column.filterOptions) {
              const {multiple, options, field = column.field, defaultValue, ...otherOptions} = column.filterOptions

              let dropdownValue = this.activeFilters.get(field) || (multiple ? [] : '')
              dropdownValue = isObservableArray(dropdownValue) ? dropdownValue.slice() : dropdownValue
              return (
                <div className='filter-item' key={field}>
                  <Dropdown
                    selection
                    selectOnBlur={false}
                    placeholder={`Filter ${column.header}`}
                    multiple={multiple}
                    options={options}
                    value={dropdownValue}
                    onChange={(event, data) => this.handleFilterChange(field, data.value)}
                    {...otherOptions}
                  />
                  {!multiple && this.activeFilters.get(field) &&
                  <Icon className='remove-filter-icon' name='remove circle' onClick={() => this.handleFilterChange(field, null)} />
                  }
                </div>
              )
            }
          })}
        </div>
        <div className='resource-table-container'>
          <Table
            sortable
            celled
            definition
            className='resource-table'
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell/>
                {this.visibleColumns.map(column => {
                  return (
                    <Table.HeaderCell
                      key={column.header}
                      sorted={(column.sortKey || column.field) === this.sortColumn ? this.sortDirection : null}
                      onClick={() => this.handleSort(column.sortKey || column.field)}
                      {...column.cellProps}
                    >
                      {column.header}
                    </Table.HeaderCell>
                  )
                })
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.visibleRows.map(row => {
                const visibleColumnFields = this.visibleColumns.map(col => col.field)
                  return (
                    <Table.Row
                      key={row.id}
                      onClick={() => showResourceSidebar(resource, row.id)}
                    >
                      <Table.Cell collapsing>
                        <span className='row-actions'>
                          <Dropdown
                            icon='ellipsis horizontal'
                          >
                            <Dropdown.Menu>
                              <Dropdown.Item
                                icon='edit'
                                text={`Edit ${row.resourcePrettySingular}`}
                                onClick={() => this.props.uiStore.showModal(
                                  'RESOURCE_MODAL', {resourceName: resource, resourceId: row.id}
                                )}
                              />
                              <Dropdown.Item text={`Duplicate ${row.resourcePrettySingular}`} icon='copy' onClick={() => null} disabled/>
                              <Dropdown.Item text={`Delete ${row.resourcePrettySingular}`} icon='trash' onClick={() => row.destroy()}/>
                            </Dropdown.Menu>
                          </Dropdown>
                        </span>
                      </Table.Cell>
                      {row.tableData.filter(col => visibleColumnFields.includes(col.field)).map(column => {
                        return (
                          <Table.Cell
                            key={column.header}
                            {...column.cellProps}
                          >
                            {this.renderCell(column, row)}
                          </Table.Cell>
                        )}
                      )}
                    </Table.Row>
                  )}
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default ResourceTable;

ResourceTable.propTypes = {
  resource: PropTypes.string.isRequired
}
