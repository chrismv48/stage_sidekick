import React from 'react';
import {Feed} from "semantic-ui-react";
import './ActivityFeed.scss'

const faker = require('faker');


const events = [
  {
    date: '1 hour ago',
    summary: `${faker.name.findName()} uploaded an image`,
    image: faker.image.avatar()
  },
  {
    date: '7 hours ago',
    summary: `${faker.name.findName()} updated the description`,
    image: faker.image.avatar()
  },
  {
    date: '2 days ago',
    summary: `${faker.name.findName()} created this page`,
    image: faker.image.avatar()
  }
]

class ActivityFeed extends React.Component {

  render() {
    return (
        <Feed events = {events}/>
    )
  }
}


ActivityFeed.propTypes = {};

export default ActivityFeed
