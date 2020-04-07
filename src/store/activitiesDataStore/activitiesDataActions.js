import { takeLatest, put, call } from "redux-saga/effects";

import host from "../../../host";

export const reqActivities = () => {
  return { type: "REQUEST_ACTIVITIES" };
};

export const reqActivitiesSucess = activitiesData => {
  return { type: "REQUEST_ACTIVITIES_SUCCEEDED", data: activitiesData };
};

export const reqActivitiesError = err => {
  return { type: "REQUEST_ACTIVITIES_FAILED", error: err };
};

export const fetchVisits = (date) => {
  return { type: "FETCHED_VISIT_ACTIVITIES", date };
};

export const fetchHistory = (code) => {
  return { type: "FETCHED_HISTORY_ACTIVITIES", code };
};

export const addToHistory = (code, day, time) => {
  return { type: "ADD_TO_HISTORY", code, day, time };
}

export function* watchFetchActivities() {
  yield takeLatest("FETCHED_VISIT_ACTIVITIES", fetchVisitsAsync);
  yield takeLatest("FETCHED_HISTORY_ACTIVITIES", fetchHistoryAsync);
  yield takeLatest("ADD_TO_HISTORY", addToHistoryAsync);
}

function* fetchVisitsAsync({ date }) {
  try {
    yield put(reqActivities());
    yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getVisits/${encodeURI(date)}`).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
}


function* fetchHistoryAsync({ code }) {
  try {
    yield put(reqActivities());
    yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getActivities/${encodeURI(code)}`).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
}

function* addToHistoryAsync({ code, day, time }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "code": code, "date": day, "time": time })
  };
  try {
    yield put(reqActivities());
    yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getActivities/addToHistory`, requestOptions).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
}


function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}