import {call, put, takeEvery} from 'redux-saga/effects';
import Api from "./api";

export const ACTION_RESOURCE_INITIATED = (action, resource) => `${action.toUpperCase()}_${resource.toUpperCase()}_INITIATED`
export const ACTION_RESOURCE_SUCCEEDED = (action, resource) => `${action.toUpperCase()}_${resource.toUpperCase()}_SUCCEEDED`
export const ACTION_RESOURCE_FAILED = (action, resource) => `${action.toUpperCase()}_${resource.toUpperCase()}_FAILED`
export const ACTION_RESOURCE_COMPLETED = (action, resource) => `${action.toUpperCase()}_${resource.toUpperCase()}_COMPLETED`

function* fetchResource(action) {
  const {resource, endpoint} = action
  const method = 'GET'
  console.log(`Fetching resource: ${endpoint}`)
  // try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, resource), resource});
    const response = yield call(() => Api(endpoint, method));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, resource), resource, response});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, resource), resource});
  // } catch (error) {
  //   yield put({type: ACTION_RESOURCE_FAILED(method, resource), resource, error});
  // }
}

function* postResource(action) {
  const {resource, endpoint, payload} = action
  const method = 'POST'
  console.log(`Posting resource: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, resource)});
    const response = yield call(() => Api(endpoint, method, payload));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, resource), resource, response});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, resource), resource});
  } catch (error) {
    yield put({type: ACTION_RESOURCE_FAILED(method, resource), resource, error});
  }
}

function* putResource(action) {
  const {resource, endpoint, payload} = action
  const method = 'PUT'
  console.log(`Putting resource: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, resource)});
    const response = yield call(() => Api(endpoint, method, payload));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, resource), resource, response});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, resource), resource});
  } catch (error) {
    yield put({type: ACTION_RESOURCE_FAILED(method, resource), error});
  }
}

function* deleteResource(action) {
  const {resource, endpoint} = action
  const method = 'DELETE'
  console.log(`Deleting resource: ${endpoint}`)
  try {
    yield put({type: ACTION_RESOURCE_INITIATED(method, resource)});
    const response = yield call(() => Api(endpoint, method));
    yield put({type: ACTION_RESOURCE_SUCCEEDED(method, resource)});
    yield put({type: ACTION_RESOURCE_COMPLETED(method, resource)});
  } catch (error) {
    debugger
    yield put({type: ACTION_RESOURCE_FAILED(method, resource), error});
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
