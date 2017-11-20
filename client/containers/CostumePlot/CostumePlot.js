import React from 'react';
import {connect} from 'react-redux';
import './CostumePlot.scss'
import {Dimmer, Grid, Loader, Segment,} from 'semantic-ui-react'
import {fetchResource} from "../../api/actions"
import * as _ from "lodash";
import 'react-table/react-table.css'
import ReactTable from "react-table";
import SceneFragment from "../../components/Fragment/SceneFragment";
import CharacterFragment from "../../components/Fragment/CharacterFragment";
import CostumeFragment from "../../components/Fragment/CostumeFragment";

@connect((state, ownProps) => {
  const {dispatch} = state
  const {
    characters: {byId: charactersById} = {},
    roles: {byId: rolesById} = {},
    scenes: {byId: scenesById} = {},
    costumes: {byId: costumesById} = {},
  } = state.resources
  return {
    dispatch,
    charactersById,
    scenesById,
    rolesById,
    costumesById,
  }
})

export class CostumePlot extends React.Component {

  componentWillMount() {
    this.props.dispatch(fetchResource('characters', `characters`))
    // TODO: being lazy here and getting all characters/scenes even though we really only need some
    this.props.dispatch(fetchResource('scenes', 'scenes'))
    this.props.dispatch(fetchResource('roles', 'roles'))
    this.props.dispatch(fetchResource('costumes', 'costumes'))
  }

  renderCharacter(characterId) {
    const {charactersById, rolesById} = this.props
    const character = charactersById[characterId]
    const characterRole = _.isEmpty(character.role_ids) ? {} : rolesById[character.role_ids[0]]
    return (
      <CharacterFragment character={character} actor={characterRole}/>
    )
  }

  getCostumeByCharacterScene(characterId, sceneId) {
    const {costumesById} = this.props
    for (let costume of Object.values(costumesById)) {
      if (costume.scene_ids.includes(parseInt(sceneId)) && costume.character_ids.includes(parseInt(characterId))) {
        return costume
      }
    }
  }

  render() {
    const {charactersById, rolesById, scenesById, costumesById} = this.props
    if (!charactersById || !rolesById || !scenesById || !costumesById) {
      return (
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }


    const data = Object.keys(charactersById).map(characterId => {
      let row = {}
      Object.keys(scenesById).forEach(sceneId => {
        row[`scene${sceneId}`] = this.getCostumeByCharacterScene(characterId, sceneId)
      })

      row['character'] = characterId
      return row
    })

    const characterColumn = [
      {
        Header: 'Character',
        accessor: 'character',
        Cell: ({value}) => this.renderCharacter(value),
        style: {whiteSpace: 'normal', padding: '15px'},
        headerStyle: {whiteSpace: 'normal', padding: '15px'},
      },
    ]

    const sceneColumns = Object.values(scenesById).map(scene => {
      return {
        Header: () => <SceneFragment scene={scene}/>,
        accessor: `scene${scene.id}`,
        Cell: ({value}) => <CostumeFragment costume={value}/>,
        style: {whiteSpace: 'normal', padding: '15px'},
        headerStyle: {whiteSpace: 'normal', padding: '15px'},
      }
    })

    const columns = characterColumn.concat(sceneColumns)

    console.log(columns)
    console.log(data)

    return (
      <Grid className="CostumePlot">
        <Grid.Column className="CostumePlot">
          <ReactTable
            data={data}
            columns={columns}
            showPagination={false}
            resizable={false}
            minRows={0}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default CostumePlot;
