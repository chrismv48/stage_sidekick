/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import apiReducer from "./api/reducer";
import rootModal from "./containers/Modals/reducer";
import detailSidebar from "./containers/DetailSidebar/reducer";

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    routing: routerReducer,
    entities: apiReducer,
    modal: rootModal,
    sidebar: detailSidebar,
    ...asyncReducers,
  });
}
