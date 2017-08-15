import {call, put} from 'redux-saga/effects';
import {takeLatest} from "redux-saga";

const Api = (endpoint) => {
  return fetch(`http://localhost:3005/${endpoint}`)
    .then(response => {
      return response.json()
        .then(data => data)
    })
    .catch(error => {
      throw error;
    })
};

function* loadDirectory(action) {
  console.log(action)
  try {
    const staff = yield call(() => Api('productions/1/directory'));
    console.log(staff)
    yield put({type: "FETCH_DIRECTORY_SUCCESS", staff: staff});
  } catch (e) {
    yield put({type: "FETCH_DIRECTORY_FAILED", message: e.message});
  }
}

function* directorySaga() {
  yield takeLatest("FETCH_DIRECTORY", loadDirectory);
}

// Your sagas for this container
export default [
  directorySaga
];
