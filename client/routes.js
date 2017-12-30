import React from 'react';
import {Route} from 'react-router-dom'

import App from './containers/App/App'
import Characters from "./containers/Characters/Characters";

const routes = () => {
  return (
    <div>
      <Route exact path='/' component={App}/>
      <Route path='/characters' component={Characters}/>
    </div>
  );
};

export default routes;
