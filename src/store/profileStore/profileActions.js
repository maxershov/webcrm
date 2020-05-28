import { takeLatest, put, call } from "redux-saga/effects";
import { pushNewPerson } from "../personsDataStore/personsDataActions";
import host from "../../../host";
import { reqActivitiesSuccess } from "../activitiesDataStore/activitiesDataActions";
import {sleep} from "../storeGetters";

export const reqProfile = () => {
  return { type: "REQUEST_PROFILE" };
};


export const reqProfileSuccess = profile => {
  return { type: "REQUEST_PROFILE_SUCCEEDED", data: profile };
};


export const reqProfileError = err => {
  return { type: "REQUEST_PROFILE_FAILED", error: err };
};


export const fetchProfile = (code) => {
  return { type: "FETCHED_PROFILE", code };
};


export const chgProfileValue = (code, inputType, inputValue) => {
  return { type: "CHANGE_PROFILE_VALUE", code, inputType, inputValue };
};


export const chgCode = (oldCode, code) => {
  return { type: "CHANGE_CODE", oldCode, code };
};


export const addNewProfile = (code) => {
  return { type: "ADD_NEW_PROFILE", code };
};


export const deleteProfile = (code) => {
  return { type: "DELETE_PROFILE", code };
};


export function* watchFetchProfile() {
  yield takeLatest("FETCHED_PROFILE", fetchProfileAsync);
  yield takeLatest("CHANGE_PROFILE_VALUE", changeFieldAsync);
  yield takeLatest("CHANGE_CODE", changeCodeAsync);
  yield takeLatest("ADD_NEW_PROFILE", addNewProfileAsync);
  yield takeLatest("DELETE_PROFILE", deleteProfileAsync);
}


function* fetchProfileAsync({ code }) {
  try {
    yield put(reqProfile());
    // yield sleep(1000);
    const data = yield call(() => {
      return fetch(`http://${host}:6700/getProfile/${encodeURI(code)}`).then(res =>
        res.json()
      );
    });
    yield put(reqProfileSuccess(data[0]));
  } catch (err) {
    yield put(reqProfileError(err));
  }
};


function* changeFieldAsync({ code, inputType, inputValue }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "code": code, "type": inputType, "value": inputValue })
  };
  try {
    const updatedData = yield call(() => {
      return fetch(`http://${host}:6700/updateField`, requestOptions)
        .then(res => res.json());
    });
    yield put(reqProfileSuccess(updatedData[0]));
  } catch (err) {
    yield put(reqProfileError(err));
  }
};


function* changeCodeAsync({ oldCode, code }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "oldCode": oldCode, "code": code })
  };
  try {
    const updatedData = yield call(() => {
      return fetch(`http://${host}:6700/updateCode`, requestOptions)
        .then(res => res.json());
    });
    // handle history change
    const updatedHistoryData = yield call(() => {
      return fetch(`http://${host}:6700/changeActivityCode`, requestOptions)
        .then(res => res.json());
    });
    yield put(reqProfileSuccess(updatedData[0]));
    yield put(reqActivitiesSuccess(updatedHistoryData))
  } catch (err) {
    yield put(reqProfileError(err));
  }
};


function* addNewProfileAsync({ code }) {
  try {
    const newPerson = yield call(() => {
      return fetch(`http://${host}:6700/addNewPerson/${encodeURI(code)}`).then(res =>
        res.json()
      );
    });
    // push new person to personData
    yield put(pushNewPerson(newPerson[0]));
    yield put(reqProfileSuccess(newPerson[0]));
  } catch (err) {
    yield put(reqProfileError(err));
  }
};


function* deleteProfileAsync({ code }) {
  yield put(reqProfile());
  try {
    yield call(() => {
      return fetch(`http://${host}:6700/deleteProfile/${encodeURI(code)}`)
    });
    // yield put(reqProfileSuccess(undefined));
  } catch (err) {
    yield put(reqProfileError(err));
  }
};
