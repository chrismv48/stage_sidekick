import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";
import React from 'react';
import {connect} from 'react-redux';
import './Costumes.scss'
import {Button, Card, Dimmer, Dropdown, Grid, Header, Image, Input, Loader, Popup, Segment} from 'semantic-ui-react'
import Layout from "../../components/Layout/index";
import {deleteResource, fetchResource} from "../../api/actions"
import {showModal} from "../Modals/actions";

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

  handleDestroyCostume = (costumeId) => {
    this.props.dispatch(deleteResource('costume', `costumes/${costumeId}`))
    this.props.dispatch(fetchResource('costumes', 'costumes'))
  }

  render() {
    const {loading, byId: costumesById = {}, allIds: costumesAllIds = []} = this.props.costumes
    const {dispatch, rolesById} = this.props
    const {cardsPerRow} = this.state

    return (
      <Layout thisPage={this.props.route.name}>
        <div className="Costumes">
          <Grid className="content-container">
            <Grid.Row>
              <Grid.Column>
                <Header as="h2" dividing>
                  Costumes
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceType: 'costumes', resourceId: null}))} primary>
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
                  <Card.Group itemsPerRow={cardsPerRow}>
                    {costumesAllIds.map((costumeId) => {
                      let costume = costumesById[costumeId]
                      const costumeImageUrl = costume.display_image ? costume.display_image.url : null
                      // const costumeRole = _.isEmpty(costume.roles) ? null : rolesById[costume.roles[0]]
                        return (
                          <Card raised key={costumeId} className="costume-card" href={`/costumes/${costumeId}`}>
                            <div key={costumeId} className="card-edit-panel">
                              <Icon style={{height: "initial"}} name="move"/>
                              <div className="card-edit-dropdown">
                                <Dropdown icon="ellipsis vertical">
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => dispatch(showModal('RESOURCE_MODAL', {resourceType: 'costumes', resourceId: costumeId}))}
                                                   icon="edit"
                                                   text="Edit Costume"/>
                                    <Dropdown.Item onClick={() => this.handleDestroyCostume(costumeId)}
                                                   icon="trash"
                                                   text="Delete Costume"/>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <Image src={costumeImageUrl} height={200} />
                            <Card.Content>
                              <div className={this.state.flipped ? "card-effect" : ""}>
                                <div className="card-front">
                                  <Card.Header>{costume.title}</Card.Header>
                                  <Card.Meta>
                                    Some meta for ya
                                  </Card.Meta>
                                  <Card.Description>
                                      {costume.description}
                                  </Card.Description>
                                </div>
                                <div className="card-back">
                                  Card back
                                </div>
                              </div>
                            </Card.Content>
                            <Card.Content extra>
                              <div style={{textAlign: 'center'}}>
                                <span
                                  onClick={() => this.setState({flipped: !this.state.flipped})}>
                                  {costume.scenes && costume.scenes.length} Scenes
                                </span>
                              </div>
                            </Card.Content>
                          </Card>
                        )
                      }
                    )}
                  </Card.Group>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default Costumes;
