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
    return this.model.tableColumns
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

  constructor(props) {
    super(props)

    this.hiddenColumns = this.initializeHiddenColumns()
  }

  initializeHiddenColumns() {
    return this.columns.filter(col => col.defaultVisible === false).map(col => col.field)
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
      return column.renderCell(row)
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
    Promise.all(loadRelationships).then(() => this.loading = false)
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
              const {multiple, options, field = column.field} = column.filterOptions
              let dropdownValue = this.activeFilters.get(field) || (multiple ? [] : '')
              dropdownValue = isObservableArray(dropdownValue) ? dropdownValue.slice() : dropdownValue
              return (
                <div className='filter-item' key={field}>
                  <Dropdown
                    selection
                    closeOnChange
                    placeholder={`Filter ${column.header}`}
                    multiple={multiple}
                    options={options(this.props.resourceStore)}
                    value={dropdownValue}
                    onChange={(event, data) => this.handleFilterChange(field, data.value)}
                  />
                  {!multiple && this.activeFilters.get(field) &&
                  <Icon className='remove-filter-icon' name='remove circle' onClick={() => this.handleFilterChange(field, null)} />
                  }
                </div>
              )
            }
          })}
        </div>
        <Table
          collapsing
          celled
          selectable
          sortable
        >
          <Table.Header>
            <Table.Row>
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
                return (
                  <Table.Row
                    style={{cursor: 'pointer'}}
                    key={row.id}
                    onClick={() => showResourceSidebar(resource, row.id)}
                  >
                    {this.visibleColumns.map(column => {
                        return (
                          <Table.Cell
                            key={column.header}
                            {...column.cellProps}
                          >
                            {this.renderCell(column, row)}
                          </Table.Cell>
                        )
                      }
                    )}
                  </Table.Row>
                )
              }
            )}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default ResourceTable;

ResourceTable.propTypes = {
  resource: PropTypes.string.isRequired
}
