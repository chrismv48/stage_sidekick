import React from 'react'
import {render} from 'react-dom';
import {BrowserRouter as Router, withRouter} from 'react-router-dom'
import {AppContainer} from 'react-hot-loader'

import routes from './routes'

import 'semantic-ui-css/semantic.min.css'
import App from "./containers/App/App";

const AppWithRouter = withRouter(App)

const renderApp = () => {
  render(

      <AppContainer>
        <Router>
          <AppWithRouter/>
        </Router>
      </AppContainer>,

    document.getElementById('app')
  )
}

renderApp(routes)

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    const newRoutes = require('./containers/App/App').default;
    renderApp(newRoutes);
  });
}

