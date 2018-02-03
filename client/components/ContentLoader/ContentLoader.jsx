import React from 'react';
import './ContentLoader.scss'
import {Dimmer, Loader, Segment} from "semantic-ui-react";


class ContentLoader extends React.Component {

  render() {
    return (
      <Segment basic>
        <Dimmer active inverted>
          <Loader active inverted inline='centered'/>
        </Dimmer>
      </Segment>
    )
  }
}


ContentLoader.propTypes = {};

export default ContentLoader
