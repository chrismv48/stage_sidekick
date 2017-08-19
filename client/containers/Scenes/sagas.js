import {call, put, takeLatest} from 'redux-saga/effects';
import Api from "../../api";

function* loadScenes(action) {
  try {
    console.log(action)
    const scenes = yield call(() => Api('scenes'));
    yield put({type: "FETCH_SCENES_SUCCESS", scenes});
  } catch (e) {
    yield put({type: "FETCH_SCENES_FAILED", message: e.message});
  }
}

function* scenesSaga() {
  yield takeLatest("FETCH_SCENES", loadScenes);
}

// Your sagas for this container
export default [
  scenesSaga
];
