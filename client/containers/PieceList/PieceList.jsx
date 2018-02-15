import React from 'react';
import './PieceList.scss'
import {Grid, Image} from 'semantic-ui-react'
import {uniq} from "lodash";
import 'react-table/react-table.css'
import SceneFragment from "components/Fragment/SceneFragment";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import CostumeItemTable from "./CostumeItemTable";
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class PieceList extends React.Component {

  @observable loading = true

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadCostumes(),
      this.props.resourceStore.loadCharacters(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadActors(),
      this.props.resourceStore.loadCostumeItems(),
    ]).then(() => this.loading = false)
  }

  buildPieceList() {
    const {actors, costumes, costume_items, characters} = this.props.resourceStore
    const pieceList = []
    for (let costume of costumes) {
      const costumeCharacterIds = costume.characterIds.length > 0 ? uniq(costume.characterIds) : [null]
      for (let characterId of costumeCharacterIds) {
        const character = characters.find(character => character.id === characterId) || {}
        const characterActorIds = character.actorIds && uniq(character.actorIds).length > 0 ? character.actorIds : [null]

        for (let actorId of characterActorIds) {
          const actor = actors.find(actor => actor.id === actorId)

          const entry = {}
          entry.costume = costume
          entry.character = character
          entry.actor = actor
          entry.sceneIds = costume.characters_scenes.filter(character_scene => character_scene.character_id === characterId).map(char_scene => char_scene.scene_id)
          entry.costumeItemIds = costume.costumeItemIds.slice()
          pieceList.push(entry)
        }
      }
    }

    return pieceList
  }

  renderCharacterColumn(character, actor) {
    return (
      <div className='character-actor-container'>
        <Image style={{maxHeight: 200}} centered rounded src={character.primaryImage}/>
        <div style={{marginTop: 10}}>
          <a href={`/characters/${character.id}`}>
            <strong>{character.name}</strong>
          </a>
        </div>
        <div style={{marginTop: 10}}>
          Played by <a href={`/cast/${actor.id}`}>{actor.fullName}</a>
        </div>
      </div>
    )
  }

  renderCostumeColumn(costume, sceneIds) {
    return (
      <div className='costume-container'>
        <Image style={{maxHeight: 200}} centered rounded src={costume.primaryImage}/>
        <div style={{marginTop: 10}}>
          <strong>
            <a href={`/costumes/${costume.id}`}>{costume.title}</a>
          </strong>
        </div>
        {sceneIds.length > 0 &&
        <div>
          <div style={{textAlign: 'left', marginTop: 10}}><strong>Scenes</strong></div>
          {sceneIds.map((sceneId, i) => {
            const scene = this.props.resourceStore.scenes.find(scene => scene.id === sceneId)
            return (
              <SceneFragment key={i} scene={scene}/>
            )
          })
          }
        </div>
        }
      </div>
    )
  }


  render() {
    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    const pieceList = this.buildPieceList()
    return (
      <Grid className='PieceList'>
        <Grid.Column>
          {
            pieceList.map(({costume, character, actor, sceneIds, costumeItemIds}, i) => {
              return (
                <div key={i} className='piece-container'>
                  <div className='character-actor-column column'>
                    {this.renderCharacterColumn(character, actor)}
                  </div>
                  <div className='costume-column column'>
                    {this.renderCostumeColumn(costume, sceneIds)}
                  </div>
                  <div className='table-column column'>
                    <CostumeItemTable costumeId={costume.id} />
                  </div>
                </div>
              )
            })
          }
        </Grid.Column>
      </Grid>
    )
  }
}

export default PieceList;
