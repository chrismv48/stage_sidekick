import {call, put, takeEvery} from 'redux-saga/effects';
import Api from "./api";
import {updateResourceOrderIndex} from "./actions";

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
    yield put({type: ACTION_RESOURCE_FAILED(method, resource), error});
  }
}

function* swapResourceOrderIndex(action) {
  // console.log('swap resource saga')
  const {resource = 'resource', oldIndex, newIndex} = action
  yield put(updateResourceOrderIndex(resource, oldIndex, newIndex))
  const payload = {order_index_swap: [oldIndex, newIndex]}
  yield call(() => Api(resource, 'POST', payload))
}

function* apiSaga() {
  yield takeEvery((action) => action.type.startsWith("FETCH"), fetchResource);
  yield takeEvery((action) => action.type.startsWith("CREATE"), postResource);
  yield takeEvery((action) => action.type.startsWith("MODIFY"), putResource);
  yield takeEvery((action) => action.type.startsWith("DESTROY"), deleteResource);

  yield takeEvery('SWAP_RESOURCE_ORDER_INDEX', swapResourceOrderIndex);
}

export default [
  apiSaga
];
