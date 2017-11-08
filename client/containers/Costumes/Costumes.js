import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";
import React from 'react';
import {connect} from 'react-redux';
import './Costumes.scss'
import {Button, Dimmer, Grid, Header, Input, Loader, Popup, Segment} from 'semantic-ui-react'
import {deleteResource, fetchResource} from "../../api/actions"
import {showModal} from "../Modals/actions";
import CardGroup from "../../components/CardGroup/CardGroup";
import DisplayCard from "../../components/DisplayCard/DisplayCard";

@connect(state => {
  const {dispatch} = state
  const {
    costumes = {},
    characters = {},
    scenes = {},
  } = state.resources
  return {
    dispatch,
    costumes,
    characters,
    scenes
  }
})

export class Costumes extends React.Component {

  state = {
    flipped: false,
    cardsPerRow: 4
  }

  componentWillMount() {
    this.props.dispatch(fetchResource('costumes', 'costumes'))
  }

  handleEditCostume = (event, costumeId) => {
    event.preventDefault()
    this.props.dispatch(showModal('RESOURCE_MODAL', {resourceName: 'costumes', resourceId: costumeId}))
  }


  handleDestroyCostume = (costumeId) => {
    this.props.dispatch(deleteResource('costume', `costumes/${costumeId}`))
    this.props.dispatch(fetchResource('costumes', 'costumes'))
  }

  render() {
    const {loading, byId: costumesById = {}, allIds: costumesAllIds = []} = this.props.costumes
    const {dispatch, rolesById} = this.props
    const {cardsPerRow} = this.state

    return (
        <Grid className="Costumes">
          <Grid.Row>
            <Grid.Column>
              <Header as="h2" dividing>
                Costumes
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceName: 'costumes', resourceId: null}))} primary>
                <Icon name='add user'/>
                Add Costume
              </Button>
              <Popup
                trigger={<a>{cardsPerRow} per page</a>}
                content={<Input type="range" min="1" max="8" step="1" value={cardsPerRow}
                                onChange={(e) => this.setState({cardsPerRow: e.target.value})}/>}
                on='click'
                position='top right'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment basic style={{padding: 0}}>
                <Dimmer active={loading} inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
                <CardGroup itemsPerRow={cardsPerRow} resource={'costumes'}>
                  {costumesAllIds.map((costumeId, i) => {
                    let costume = costumesById[costumeId]
                    const costumeImageUrl = costume.display_image ? costume.display_image.url : null
                      return (
                        <DisplayCard
                          cardImage={costumeImageUrl}
                          showEditBar
                          header={costume.title}
                          meta='Wut should go here?'
                          frontDescription={costume.description}
                          extra={'idk yet'}
                          onEditCallback={(event) => this.handleEditCostume(event, costumeId)}
                          onDeleteCallback={(event) => this.handleDestroyCostume(event, costumeId)}
                          label='Costume'
                          key={`index-${i}`}
                          link={`costumes/${costumeId}`}
                          sortable={false}
                          index={i}
                        />
                      )
                    }
                  )}
                </CardGroup>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

export default Costumes;
