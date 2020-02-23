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

export const fetchActivities = () => {
  return { type: "FETCHED_ACTIVITIES" };
};

export function* watchFetchActivities() {
  yield takeLatest("FETCHED_ACTIVITIES", fetchActivitiesAsync);
}

function* fetchActivitiesAsync() {
  try {
    yield put(reqActivities());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getactivity`).then(res =>
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