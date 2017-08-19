import {call, put, select, takeLatest} from 'redux-saga/effects';
import Api from "../../api";

function* loadCharacter(action) {
  console.log(action)
  try {
    yield put({type: "FETCH_CHARACTER_INITIATED"});
    const character = yield call(() => Api(`characters/${action.characterId}`));
    yield put({type: "FETCH_CHARACTER_SUCCESS", character});
  } catch (e) {
    yield put({type: "FETCH_CHARACTER_FAILED", message: e.message});
  }
}

function* submitCharacter(action) {
  console.log('this shit fired')
  try {
    const state = yield select()
    const formFields = state.characterForm.formFields
    let method = 'POST'
    let endpoint = `characters`
    if ('id' in formFields) {
      method = 'PUT'
      endpoint = `characters/${formFields.id}`
    }
    const character = yield call(() => Api(endpoint, method, {'character': formFields}));
    yield put({type: "SUBMIT_CHARACTER_SUCCESS", character});
  } catch (e) {
    yield put({type: "SUBMIT_CHARACTER_FAILED", message: e.message});
  }
}

function* characterSaga() {
  console.log('characterSaga')
  yield takeLatest("FETCH_CHARACTER", loadCharacter);
  yield takeLatest("SUBMIT_CHARACTER_FORM", submitCharacter);
}

// Your sagas for this container
export default [
  characterSaga
];
