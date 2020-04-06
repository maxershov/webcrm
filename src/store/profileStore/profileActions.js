import { takeLatest, put, call } from "redux-saga/effects";

import host from "../../../host";

export const reqProfile = () => {
  return { type: "REQUEST_PROFILE" };
};

export const reqProfileSucess = profile => {
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
}

export const chgCode = (oldCode, code) => {
  return { type: "CHANGE_CODE", oldCode, code };
}

export function* watchFetchProfile() {
  yield takeLatest("FETCHED_PROFILE", fetchProfileAsync);
  yield takeLatest("CHANGE_PROFILE_VALUE", changeField);
  yield takeLatest("CHANGE_CODE", changeCode);
}

function* fetchProfileAsync({ code }) {
  try {
    yield put(reqProfile());
    yield sleep(1000);
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getProfile/${code}`).then(res =>
        res.json()
      );
    });
    yield put(reqProfileSucess(data[0]));
  } catch (err) {
    yield put(reqProfileError(err));
  }
}


function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}

function* changeField({ code, inputType, inputValue }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "code": code, "type": inputType, "value": inputValue })
  };
  const updatedData = yield call(() => {
    return fetch(`http://${host.host}:6700/updateField`, requestOptions)
      .then(res => res.json());
  });
  yield put(reqProfileSucess(updatedData[0]));
}

function* changeCode({ oldCode, code }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "oldCode": oldCode, "code": code })
  };
  const updatedData = yield call(() => {
    return fetch(`http://${host.host}:6700/updateCode`, requestOptions)
      .then(res => res.json());
  });
  yield put(reqProfileSucess(updatedData[0]));
}