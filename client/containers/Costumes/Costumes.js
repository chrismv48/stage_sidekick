import React from 'react';
import './Costumes.scss'
import {Grid, Header, Menu} from 'semantic-ui-react'
import MultipleItemLayout from "../../components/MultipleItemLayout/MultipleItemLayout";


export class Costumes extends React.Component {

  state = {
    activeTabName: 'Costumes'
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
                  items={[{name: 'Costumes', key: 1}, {name: 'Costume Items', key: 2}]}
            />

            {this.state.activeTabName === 'Costumes' ?
              <MultipleItemLayout resource='costumes' resourceLabel='Costumes' />
            :
              <MultipleItemLayout resource='costume_items' resourceLabel='Costume Items' />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Costumes;
