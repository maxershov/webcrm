import { takeLatest, put, call } from "redux-saga/effects";

import host from "../../../host";

export const reqDays = () => {
  return { type: "REQUEST_DAYS" };
};

export const reqDaysSucess = dayData => {
  return { type: "REQUEST_DAYS_SUCCEEDED", data: dayData };
};

export const reqDaysError = err => {
  return { type: "REQUEST_DAYS_FAILED", error: err };
};

export const fetchDays = () => {
  return { type: "FETCHED_DAYS" };
};

export function* watchFetchDays() {
  yield takeLatest("FETCHED_DAYS", fetchDaysAsync);
}

function* fetchDaysAsync() {
  try {
    yield put(reqDays());
    yield sleep(3000)
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getday`).then(res =>
        res.json()
      );
    });
    yield put(reqDaysSucess(data));
  } catch (err) {
    yield put(reqDaysError(err));
  }
}


function *sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}