import React, {PropTypes} from 'react';
import './Notes.scss'
import {Button, Grid, Header, Icon} from 'semantic-ui-react'
import ResourceTable from "components/DisplayTable/ResourceTable/ResourceTable";
import {inject, observer} from "mobx-react";
import {computed, observable} from 'mobx'
import ContentLoader from "components/ContentLoader/ContentLoader";

@inject("resourceStore", "uiStore") @observer
export class Notes extends React.Component {

  @observable loading = true

  componentDidMount() {
    Promise.all([
      this.props.resourceStore.loadNotes(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCostumes(),
      this.props.resourceStore.loadCostumeItems(),
      this.props.resourceStore.loadRoles(),
    ]).then(() => this.loading = false)
  }

  render() {
    const {notes} = this.props.resourceStore

    if (this.loading) {
      return (
        <ContentLoader/>
      )
    }

    return (
      <Grid className="Notes">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Notes
            </Header>
            <div className='button-container'>
              <Button onClick={() => this.props.uiStore.showModal('RESOURCE_MODAL', {
                resourceName: 'notes',
                resourceId: null
              })}
                      primary>
                <Icon name="add user"/>
                Add Note
              </Button>
            </div>
            <ResourceTable resource='notes'/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Notes;
