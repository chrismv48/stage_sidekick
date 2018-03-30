import React from 'react';
import './PieceList.scss'
import {Grid, Image} from 'semantic-ui-react'
import {sortBy, uniq} from "lodash";
import 'react-table/react-table.css'
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import CostumeItemTable from "./CostumeItemTable";
import ContentLoader from "components/ContentLoader/ContentLoader";
import {Link} from "react-router-dom";

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
          entry.sceneIds = costume.costumes_characters_scenes.filter(ccs => ccs.character_id === characterId).map(ccs => ccs.scene_id)
          entry.costumeItemIds = costume.costumeItemIds.slice()
          pieceList.push(entry)
        }
      }
    }

    return pieceList
  }

  renderCostumeColumn(costume, sceneIds, character, actor) {
    return (
      <div className='costume-container'>
        <Image style={{maxHeight: 200}} centered rounded src={costume.primaryImage}/>
        <div className='section'>
          <strong>
            <a
              style={{cursor: 'pointer'}}
              onClick={() => this.store.rootStore.uiStore.showResourceSidebar(costume.id, costume.resource)}
            >
              {costume.title}
            </a>
          </strong>
        </div>
        <div className='section'>
          <a
            style={{cursor: 'pointer'}}
            onClick={() => this.store.rootStore.uiStore.showResourceSidebar(character.id, character.resource)}
          >
            {character.name}
          </a>  <span className='divider'>|</span>  <Link to={actor.href}>{actor.fullName}</Link>
        </div>
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
            sortBy(pieceList, piece => piece.actor.id).map(({costume, character, actor, sceneIds, costumeItemIds}, i) => {
              return (
                <div key={i} className='piece-container'>
                  <div className='costume-column column'>
                    {this.renderCostumeColumn(costume, sceneIds, character, actor)}
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
