import { takeLatest, put, call } from "redux-saga/effects";

import host from "../../../host";

export const reqPersons = () => {
  return { type: "REQUEST_PERSONS" };
};

export const reqPersonsSucess = personsData => {
  console.log("REQ_PERSON_SUCESS");
  return { type: "REQUEST_PERSONS_SUCCEEDED", data: personsData };
};

export const reqPersonsError = err => {
  return { type: "REQUEST_PERSONS_FAILED", error: err };
};

export const fetchPersons = () => {
  return { type: "FETCHED_PERSONS" };
};

export function* watchFetchPersons() {
  yield takeLatest("FETCHED_PERSONS", fetchPersonsAsync);
}

function* fetchPersonsAsync() {
  try {
    yield put(reqPersons());
    // yield sleep(2000)
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


function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}