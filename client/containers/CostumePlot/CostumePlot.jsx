import React from 'react';
import './CostumePlot.scss'
import {Dimmer, Grid, Loader, Segment,} from 'semantic-ui-react'
import {isEmpty} from "lodash";
import 'react-table/react-table.css'
import ReactTable from "react-table";
import SceneFragment from "components/Fragment/SceneFragment";
import CharacterFragment from "components/Fragment/CharacterFragment";
import CostumeFragment from "components/Fragment/CostumeFragment";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";

@inject("resourceStore", "uiStore") @observer
export class CostumePlot extends React.Component {

  @observable loading = true

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCostumes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadRoles(),
    ]).then(() => this.loading = false)
  }

  renderCharacter(characterId) {
    const {characters, roles} = this.props.resourceStore
    const character = characters.find(character => character.id === characterId)
    const characterRole = isEmpty(character.actor_ids) ? {} : roles.find(role => role.id === character.actor_ids[0])
    return (
      <CharacterFragment character={character} actor={characterRole} />
    )
  }

  getCostumeByCharacterScene(characterId, sceneId) {
    const {costumes} = this.props.resourceStore
    for (let costume of costumes) {
      if (costume.scene_ids.includes(parseInt(sceneId)) && costume.character_ids.includes(parseInt(characterId))) {
        return costume
      }
    }
  }

  render() {
    const {characters, scenes} = this.props.resourceStore
    if (this.loading) {
      return (
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }

    const data = characters.map(character => {
      let row = {}
      scenes.forEach(scene => {
        row[`scene${scene.id}`] = this.getCostumeByCharacterScene(character.id, scene.id)
      })

      row['character'] = character.id
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

    const sceneColumns = scenes.map(scene => {
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
