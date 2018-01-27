import React from 'react';
import './Costumes.scss'
import {Grid, Header, Menu} from 'semantic-ui-react'
import MultipleItemLayout from "components/MultipleItemLayout/MultipleItemLayout";
import CostumePlot from "containers/CostumePlot/CostumePlot";
import PieceList from 'containers/PieceList/PieceList'


export class Costumes extends React.Component {

  state = {
    activeTabName: 'Costumes'
  }

  renderContent() {
    const {activeTabName} = this.state
    if (activeTabName === 'Costumes') {
      return (
        <MultipleItemLayout resource='costumes' resourceLabel='Costumes'/>
      )
    }
    if (activeTabName === 'Costume Items') {
      return (
        <MultipleItemLayout resource='costume_items' resourceLabel='Costume Items'/>
      )
    }
    if (activeTabName === 'Costume Plot') {
      return (
        <CostumePlot/>
      )
    }
    if (activeTabName === 'Piece List') {
      return (
        <PieceList/>
      )
    }

  }

  render() {
    return (
      <Grid className="Costumes">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Costumes
            </Header>

            <Menu tabular
                  defaultActiveIndex={0}
                  onItemClick={(e, {name}) => this.setState({activeTabName: name})}
                  items={[
                    {name: 'Costumes', key: 1},
                    {name: 'Costume Items', key: 2},
                    {name: 'Costume Plot', key: 3},
                    {name: 'Piece List', key: 4},
                  ]}
            />
            {this.renderContent()}

            </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Costumes;
