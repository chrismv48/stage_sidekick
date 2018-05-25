import React from 'react';
import './Costumes.scss'
import {Header, Menu} from 'semantic-ui-react'
import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout";
import CostumePlot from "containers/CostumePlot/CostumePlot";
import PieceList from 'containers/PieceList/PieceList'
import DisplayModeIcons from "components/DisplayModeIcons/DisplayModeIcons";
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import DressingList from "../DressingList/DressingList";

@observer
export class Costumes extends React.Component {

  @observable activeTabName = 'Costumes'

  renderContent() {
    if (this.activeTabName === 'Costumes') {
      return (
        <MultipleItemLayout resource='costumes' resourceLabel='Costumes'/>
      )
    }
    if (this.activeTabName === 'Costume Items') {
      return (
        <MultipleItemLayout resource='costume_items' resourceLabel='Costume Items'/>
      )
    }
    if (this.activeTabName === 'Costume Plot') {
      return (
        <CostumePlot/>
      )
    }
    if (this.activeTabName === 'Piece List') {
      return (
        <PieceList/>
      )
    }

    if (this.activeTabName === 'Dressing List') {
      return (
        <DressingList/>
      )
    }

  }

  shouldDisplayIcons() {
    return ['Costumes', 'Costume Items'].includes(this.activeTabName)
  }

  render() {
    return (
      <div className="Costumes main-content">
        <Header as="h2" dividing>
          Costumes
        </Header>
        <div className='tab-menu-container'>
          <Menu tabular
                defaultActiveIndex={0}
                onItemClick={(e, {name}) => this.activeTabName = name}
                items={[
                  {name: 'Costumes', key: 1},
                  {name: 'Costume Items', key: 2},
                  {name: 'Costume Plot', key: 3},
                  {name: 'Piece List', key: 4},
                  {name: 'Dressing List', key: 5},
                ]}
          />
          {this.shouldDisplayIcons() &&
          < span className='display-mode-icons'>
              <DisplayModeIcons/>
              </span>
          }
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

export default Costumes;
