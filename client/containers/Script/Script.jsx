import React, {PropTypes} from 'react';
import './Script.scss'
import {Button, Dimmer, Grid, Header, Loader, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {observable} from "mobx";
import Line from "components/Line/Line";

@inject("resourceStore", "uiStore") @observer
export class Script extends React.Component {

  @observable loading = true
  @observable editingLineId = null
  @observable showNewLineAbove = null

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadLines(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => this.loading = false)
  }

  handleSave(lineId) {
    const line = this.props.resourceStore.getStagedResource('lines', lineId)
    debugger
    if (!lineId && this.showNewLineAbove) {
      if (this.showNewLineAbove === -1) {
        line.number = this.props.resourceStore.lines.length + 1
      } else {
        line.number = this.showNewLineAbove
      }
    }
    line.save()
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  handleCancel(lineId) {
    const line = this.props.resourceStore.getStagedResource('lines', lineId)
    line.revert()
    this.editingLineId = null
    this.showNewLineAbove = null
  }

  handleAddLine = () => {
    this.showNewLineAbove = -1
    window.scrollTo(0, document.body.scrollHeight)
  }

  handleInsertAbove(lineNumber) {
    this.showNewLineAbove = lineNumber
  }

  handleDelete(lineId) {
    const line = this.props.resourceStore.getStagedResource('lines', lineId)
    line.destroy()
  }

  render() {

    if (this.loading) {
      return (
        <Segment basic>
          <Dimmer active={true} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }

    const {lines} = this.props.resourceStore
    return (
      <Grid className="Script">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" dividing>
              Script
            </Header>
            <Button primary icon='plus' onClick={this.handleAddLine} content='Add line'/>
            <div className='lines-container'>
              {lines.sort((a, b) => a.number - b.number).map((line, i) => {
                return (
                  <React.Fragment key={i}>
                    {this.showNewLineAbove === line.number &&
                    <Line
                      lineId={null}
                      editMode={true}
                      handleSave={() => this.handleSave(null)}
                      handleCancel={() => this.handleCancel(null)}
                    />
                    }
                    <Line
                      lineId={line.id}
                      editMode={this.editingLineId === line.id}
                      handleEdit={() => this.editingLineId = line.id}
                      handleSave={() => this.handleSave(line.id)}
                      handleCancel={() => this.handleCancel(line.id)}
                      handleInsertAbove={() => this.handleInsertAbove(line.number)}
                      handleDelete={() => this.handleDelete(line.id)}
                    />
                  </React.Fragment>
                )
              })
              }
              {this.showNewLineAbove === -1 &&
              <Line
                lineId={null}
                editMode={true}
                handleSave={() => this.handleSave(null)}
                handleCancel={() => this.handleCancel(null)}
              />
              }
              {this.showNewLineAbove !== -1 &&
              <Segment className='add-line-text' onClick={() => this.showNewLineAbove = -1}>
                <p>Click to add new line</p>
              </Segment>
              }
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Script;
