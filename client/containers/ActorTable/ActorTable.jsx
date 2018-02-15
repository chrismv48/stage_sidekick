import React from 'react';
import './ActorTable.scss'
import {Checkbox, Dropdown, Grid, Icon, Image, Label, Table} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import classNames from 'classnames'
import ActorFragment from "components/Fragment/ActorFragment";
import Actor from "containers/Actor/Actor";
import {intersection, isEmpty, orderBy, uniq} from 'lodash'
import ContentLoader from "components/ContentLoader/ContentLoader";


@inject("resourceStore", "uiStore") @observer
export class ActorTable extends React.Component {

  @observable selected = null
  @observable sidebarHeight = window.innerHeight - 140
  @observable sortDirection = null
  @observable sortColumn = null
  @observable hiddenColumns = []
  @observable selectedSceneIds = []
  @observable selectedGender = null

  @computed get actors() {
    return this.props.resourceStore.actors
  }

  @computed get abbreviatedSortDirection() {
    return this.sortDirection && this.sortDirection === 'ascending' ? 'asc' : 'desc'
  }

  @computed get visibleColumns() {
    return this.columns.filter(col => !this.hiddenColumns.includes(col.Header))
  }

  @computed get visibleRows() {
    return this.actors.filter(actor => {
      return [
        !isEmpty(this.selectedSceneIds) ? !isEmpty(intersection(actor.sceneIds, this.selectedSceneIds)) : true,
        this.selectedGender ? actor.gender === this.selectedGender : true
      ].every(condition => condition)
    })
  }

  columns = [
    {
      Header: 'Name',
      accessor: 'fullName',
      Cell: (actor) => <span onClick={() => this.selected = actor.id}>
        <ActorFragment actor={actor}/>
      </span>,
      handleSort: () => {
        const {actors} = this.props.resourceStore
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
        this.sortColumn = 'fullName'
        this.props.resourceStore.actors = orderBy(actors, this.sortColumn, this.abbreviatedSortDirection)
      }
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: actor => actor.user.email,
      handleSort: () => {
        const {actors} = this.props.resourceStore
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
        this.sortColumn = 'email'
        this.props.resourceStore.actors = orderBy(actors, 'user.email', this.abbreviatedSortDirection)
      }
    },
    {
      Header: 'Scenes',
      accessor: 'scenes',
      Cell: (actor) => <Label.Group>
        {actor.scenes.map(scene =>
          <Label as='a' image key={scene.id}>
            <Image avatar src={scene.avatar}/>
            {scene.title}
            <Icon name='delete'/>
          </Label>
        )}
      </Label.Group>,
      handleSort: () => {
        const {actors} = this.props.resourceStore
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
        this.sortColumn = 'scenes'
        this.props.resourceStore.actors = orderBy(actors, 'scenes.length', this.abbreviatedSortDirection)
      }
    },
    {
      Header: 'Characters',
      accessor: 'characters',
      Cell: (actor) => <Label.Group>
        {actor.characters.map(character =>
          <Label as='a' image key={character.id}>
            <Image avatar src={character.avatar}/>
            {character.name}
            <Icon name='delete'/>
          </Label>
        )}
      </Label.Group>,
      handleSort: () => {
        const {actors} = this.props.resourceStore
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
        this.sortColumn = 'characters'
        this.props.resourceStore.actors = orderBy(actors, 'characters.length', this.abbreviatedSortDirection)
      }
    },
    {
      Header: 'Costumes',
      accessor: 'costumes',
      Cell: (actor) => <Label.Group>
        {actor.costumes.map(costume =>
          <Label as='a' image key={costume.id}>
            <Image avatar src={costume.avatar}/>
            {costume.title}
            <Icon name='delete'/>
          </Label>
        )}
      </Label.Group>,
      handleSort: () => {
        const {actors} = this.props.resourceStore
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
        this.sortColumn = 'costumes'
        this.props.resourceStore.actors = orderBy(actors, 'costumes.length', this.abbreviatedSortDirection)
      }
    },
    {
      Header: 'Gender',
      accessor: 'gender',
      Cell: actor => actor.gender,
      handleSort: () => {
        const {actors} = this.props.resourceStore
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending'
        this.sortColumn = 'gender'
        this.props.resourceStore.actors = orderBy(actors, this.sortColumn, this.abbreviatedSortDirection)
      }
    }
  ]


  @observable loading = true
  @observable showColumnDropdown = false

  componentDidMount() {
    this.loading = true

    window.addEventListener("resize", () => this.sidebarHeight = window.innerHeight - 140);

    Promise.all([
      this.props.resourceStore.loadCostumes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadActors(),
    ]).then(() => this.loading = false)
  }

  toggleColumnVisibility = (columnName) => {
    if (this.hiddenColumns.includes(columnName)) {
      this.hiddenColumns = this.hiddenColumns.filter(col => col !== columnName)
    } else {
      this.hiddenColumns.push(columnName)
    }
  }

  handleSceneSelect = (event, data) => {
    this.selectedSceneIds = data.value
  }

  generateSceneOptions() {
    const {actors} = this.props.resourceStore
    let scenes = []
    for (let actor of actors) {
      scenes = scenes.concat(actor.scenes.slice())
    }
    return uniq(scenes).map(scene => {
      return {
        key: scene.id,
        text: scene.title,
        value: scene.id
      }
    })

  }

  generateGenderOptions() {
    return [
      {
        key: 'M',
        text: 'M',
        value: 'M'
      },
      {
        key: 'F',
        text: 'F',
        value: 'F'
      },
    ]
  }

  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }
    return (
      <Grid className="ActorTable">
        <Grid.Row>
          <Grid.Column>
            <div className='body-container'>
              <div className='actor-table'>
                <div className='filters-container'>
                  <div className='column-picker'>
                    <Dropdown
                      icon='columns'
                      open={this.showColumnDropdown}
                      onClick={() => this.showColumnDropdown = true}
                      onBlur={() => this.showColumnDropdown = false}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Header content='Display columns'/>
                        <Dropdown.Divider/>
                        {this.columns.map(column =>
                          <Dropdown.Item key={column.Header}>
                            <Checkbox
                              label={column.Header}
                              checked={!this.hiddenColumns.includes(column.Header)}
                              onChange={() => this.toggleColumnVisibility(column.Header)}
                            />
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className='scene-dropdown'>
                    <Dropdown multiple
                              selection
                              closeOnChange
                              placeholder='Filter Scenes'
                              options={this.generateSceneOptions() || []}
                              value={this.selectedSceneIds.slice() || []}
                              onChange={this.handleSceneSelect}
                    />
                  </div>
                  <div className='gender-dropdown'>
                    <Dropdown selection
                              closeOnChange
                              placeholder='Filter Gender'
                              options={this.generateGenderOptions() || []}
                              value={this.selectedGender || ''}
                              onChange={(event, data) => this.selectedGender = data.value}
                    />
                    {this.selectedGender && <Icon name='remove circle' onClick={() => this.selectedGender = null} />}
                  </div>
                </div>
                <Table
                  celled
                  selectable
                  sortable
                >
                  <Table.Header>
                    <Table.Row>
                      {this.visibleColumns.map(column => {
                        return (
                          <Table.HeaderCell
                            key={column.Header}
                            sorted={column.accessor === this.sortColumn ? this.sortDirection : null}
                            onClick={() => column.handleSort()}
                            textAlign='center'
                          >
                            {column.Header}
                          </Table.HeaderCell>
                        )
                      })}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.visibleRows.map(actor => {
                        return (
                          <Table.Row style={{cursor: 'pointer'}} key={actor.id} onClick={() => this.selected = actor.id}>
                            {this.visibleColumns.map(column => {
                                return (
                                  <Table.Cell textAlign='center' key={column.Header}>
                                    {column.Cell(actor)}
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
              <div
                className={classNames('item-detail-sidebar', {'hidden': !this.selected})}
                style={{height: this.sidebarHeight}}
              >
                <Icon name='remove circle' className='hide-sidebar-icon' onClick={() => this.selected = null}/>
                {this.selected && <Actor actorId={this.selected}/>}
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ActorTable;
