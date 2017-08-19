import {call, put, takeLatest} from 'redux-saga/effects';
import Api from "../../api";

function* loadCharacters(action) {
  console.log(action)
  try {
    const characters = yield call(() => Api('characters?production_id=1'));
    yield put({type: "FETCH_CHARACTERS_SUCCESS", characters});
  } catch (e) {
    yield put({type: "FETCH_CHARACTERS_FAILED", message: e.message});
  }
}

function* charactersSaga() {
  yield takeLatest("FETCH_CHARACTERS", loadCharacters);
}

// Your sagas for this container
export default [
  charactersSaga
];
