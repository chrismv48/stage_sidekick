/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
// Needed for redux-saga es6 generator support
import 'babel-polyfill';
// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyRouterMiddleware, browserHistory, Router} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {useScroll} from 'react-router-scroll';
import 'sanitize.css/sanitize.css';
// Import root app
import App from 'containers/App';
// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
import configureStore from './store';
// Import CSS reset and Global Styles
import './global-styles';

import 'semantic-ui-css/semantic.min.css';
// Import root routes
import createRoutes from './routes';
/* eslint-enable import/no-unresolved, import/extensions */

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
const history = syncHistoryWithStore(browserHistory, store)

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
        <Router
          history={history}
          routes={rootRoute}
          render={
            // Scroll to top when going to a new page, imitating default browser
            // behaviour
            applyRouterMiddleware(useScroll())
          }
        />
    </Provider>,
    document.getElementById('app')
  );
};

render()

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
