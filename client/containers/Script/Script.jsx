import React, {PropTypes} from 'react';
import './Script.scss'
import {Dimmer, Grid, Header, Icon, Item, Loader, Segment} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {observable} from "mobx";

@inject("resourceStore", "uiStore") @observer
export class Script extends React.Component {
  @observable loading = true

  componentDidMount() {
    this.loading = true
    Promise.all([
      this.props.resourceStore.loadLines(),
      this.props.resourceStore.loadScenes(),
      this.props.resourceStore.loadCharacters(),
    ]).then(() => this.loading = false)
  }

  renderLineTypeIcon(lineType) {
    debugger
    let iconName = ''
    let iconTitle = ''
    if (lineType === 'line') {
      iconName = 'talk'
      iconTitle = 'Character Line'
    } else if (lineType === 'song') {
      iconName = 'music'
      iconTitle = 'Song'
    } else if (lineType === 'action') {
      iconName = 'microphone slash'
      iconTitle = 'Action'
    }

    return (
      <Icon name={iconName} color='grey' size='small' className='line-type-icon' title={iconTitle} />
    )
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
            <Item.Group relaxed>
              {lines.map((line, i) => {
                return (
                    <Item key={i}>
                      <Item.Image avatar size='mini' src={line.characters[0].primary_image}/>
                      <Item.Content>
                        <Item.Header>
                          {line.characters[0].name}
                          {this.renderLineTypeIcon(line.line_type)}
                          </Item.Header>
                        <Item.Meta>
                          <span className='price'>{line.type}</span>
                        </Item.Meta>
                        <Item.Description>
                          {line.content}
                          </Item.Description>
                      </Item.Content>
                    </Item>
                  )
                }
              )}
            </Item.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Script;
