import {call, put, takeLatest} from 'redux-saga/effects';
import Api from "../../api";

function* loadDirectory(action) {
  console.log(action)
  try {
    const staff = yield call(() => Api('productions/1/directory'));
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
