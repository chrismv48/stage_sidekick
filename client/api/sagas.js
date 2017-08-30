import {call, put, takeEvery} from 'redux-saga/effects';
import Api from "./api";

export const ACTION_RESOURCE_INITIATED = (action, entity) => `${action.toUpperCase()}_${entity.toUpperCase()}_INITIATED`
export const ACTION_RESOURCE_SUCCEEDED = (action, entity) => `${action.toUpperCase()}_${entity.toUpperCase()}_SUCCEEDED`
export const ACTION_RESOURCE_FAILED = (action, entity) => `${action.toUpperCase()}_${entity.toUpperCase()}_FAILED`
export const ACTION_RESOURCE_COMPLETED = (action, entity) => `${action.toUpperCase()}_${entity.toUpperCase()}_COMPLETED`

function* fetchResource(action) {
  const {entity, endpoint} = action
  const method = 'GET'
  console.log(`Fetching entity: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, entity), entity});
    const response = yield call(() => Api(endpoint, method));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, entity), entity, response});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, entity), entity});
  } catch (error) {
    yield put({type: ACTION_RESOURCE_FAILED(method, entity), entity, error});
  }
}

function* postResource(action) {
  const {entity, endpoint, payload} = action
  const method = 'POST'
  console.log(`Posting entity: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, entity)});
    const response = yield call(() => Api(endpoint, method, payload));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, entity), entity, response});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, entity), entity});
  } catch (error) {
    yield put({type: ACTION_RESOURCE_FAILED(method, entity), entity, error});
  }
}

function* putResource(action) {
  const {entity, endpoint, payload} = action
  const method = 'PUT'
  console.log(`Putting entity: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, entity)});
    const response = yield call(() => Api(endpoint, method, payload));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, entity), entity, response});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, entity), entity});
  } catch (error) {
    yield put({type: ACTION_RESOURCE_FAILED(method, entity), error});
  }
}

function* deleteResource(action) {
  const {entity, endpoint} = action
  const method = 'DELETE'
  console.log(`Deleting entity: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, entity)});
    const response = yield call(() => Api(endpoint, method));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, entity)});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, entity)});
  } catch (error) {
    debugger
    yield put({type: ACTION_RESOURCE_FAILED(method, entity), error});
  }
}

function* apiSaga() {
  yield takeEvery((action) => action.type.startsWith("FETCH"), fetchResource);
  yield takeEvery((action) => action.type.startsWith("CREATE"), postResource);
  yield takeEvery((action) => action.type.startsWith("MODIFY"), putResource);
  yield takeEvery((action) => action.type.startsWith("DESTROY"), deleteResource);
}

export default [
  apiSaga
];
