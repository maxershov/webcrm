import { takeEvery, put, call } from "redux-saga/effects";

import host from "../../../host";

export const reqPersons = () => {
  return { type: "REQUEST_PERSONS" };
};

export const reqPersonsSucess = personsData => {
  return { type: "REQUEST_PERSONS_SUCCEEDED", data: personsData };
};

export const reqPersonsError = err => {
  return { type: "REQUEST_PERSONS_FAILED", error:err };
};

export const fetchPersons = () => {
  return { type: "FETCHED_PERSONS" };
};

export function* watchFetchPersons() {
  yield takeEvery("FETCHED_PERSONS", fetchPersonsAsync);
}

function* fetchPersonsAsync() {
  try {
    yield put(reqPersons());
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getperson`).then(res =>
        res.json()
      );
    });
    yield put(reqPersonsSucess(data));
  } catch (err) {
    yield put(reqPersonsError(err));
  }
}
