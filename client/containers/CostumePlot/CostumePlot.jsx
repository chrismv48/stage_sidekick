import React from 'react';
import './CostumePlot.scss'
import {Grid,} from 'semantic-ui-react'
import {isEmpty} from "lodash";
import 'react-table/react-table.css'
import ReactTable from "react-table";
import SceneFragment from "components/Fragment/SceneFragment";
import CharacterFragment from "components/Fragment/CharacterFragment";
import CostumeFragment from "components/Fragment/CostumeFragment";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class CostumePlot extends React.Component {

  @observable loading = true

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCostumes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadActors(),
    ]).then(() => this.loading = false)
  }

  renderCharacter(characterId) {
    const {characters, actors} = this.props.resourceStore
    const character = characters.find(character => character.id === characterId)
    const characterActor = isEmpty(character.actorIds) ? {} : actors.find(actor => actor.id === character.actorIds[0])
    return (
      <CharacterFragment popup character={character} actor={characterActor} />
    )
  }

  getCostumeByCharacterScene(characterId, sceneId) {
    const {costumes} = this.props.resourceStore
    for (let costume of costumes) {
      if (costume.sceneIds.includes(parseInt(sceneId)) && costume.characterIds.includes(parseInt(characterId))) {
        return costume
      }
    }
  }

  render() {
    const {characters, scenes} = this.props.resourceStore
    if (this.loading) {
      return (
        <ContentLoader />
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
        Header: () => <SceneFragment popup scene={scene}/>,
        accessor: `scene${scene.id}`,
        Cell: ({value}) => <CostumeFragment popup costume={value}/>,
        style: {whiteSpace: 'normal', padding: '15px'},
        headerStyle: {whiteSpace: 'normal', padding: '15px'},
      }
    })

    const columns = characterColumn.concat(sceneColumns)

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
