import { takeLatest, put, call } from "redux-saga/effects";
import host from "../../../host";
import { sleep } from "../storeGetters";

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


export const addToVisits = (code, date, time, amount) => {
  return { type: "ADD_TO_VISITS", code, date, time, amount };
};


export const addToHistory = (code, date, time, typeInput, person, amount) => {
  return { type: "ADD_TO_HISTORY", code, date, time, typeInput, person, amount };
};


export const deleteHistoryObj = (code, date, time, typeInput, person, amount) => {
  return { type: "DELETE_HISTORY_OBJECT", code, date, time, typeInput, person, amount };
};


export function* watchFetchActivities() {
  yield takeLatest("FETCHED_VISIT_ACTIVITIES", fetchVisitsAsync);
  yield takeLatest("FETCHED_HISTORY_ACTIVITIES", fetchHistoryAsync);
  yield takeLatest("ADD_TO_VISITS", addToVisitsAsync);
  yield takeLatest("ADD_TO_HISTORY", addToHistoryAsync);
  yield takeLatest("DELETE_HISTORY_OBJECT", deleteHistoryObjAsync);
};


function* fetchVisitsAsync({ date }) {
  try {
    yield put(reqActivities());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host}:6700/getVisits/${encodeURI(date)}`).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
};


function* fetchHistoryAsync({ code }) {
  try {
    yield put(reqActivities());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host}:6700/getActivities/${encodeURI(code)}`).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
};


function* addToVisitsAsync({ code, date, time, amount }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "code": code, "date": date, "time": time, "amount": amount })
  };
  try {
    yield put(reqActivities());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host}:6700/addToVisits`, requestOptions).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
};


function* addToHistoryAsync({ code, date, time, typeInput, person, amount }) {
  // console.log("AAAADDDD", code, date, time, typeInput, person, amount);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { "code": code, "date": date, "time": time, "type": typeInput, "person": person, "amount": amount })
  };
  try {
    yield put(reqActivities());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host}:6700/addActivity`, requestOptions).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
};


function* deleteHistoryObjAsync({ code, date, time, typeInput, person, amount }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { "code": code, "date": date, "time": time, "type": typeInput, "person": person, "amount": amount })
  };
  try {
    yield put(reqActivities());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`http://${host}:6700/delActivity`, requestOptions).then(res =>
        res.json()
      );
    });
    yield put(reqActivitiesSucess(data));
  } catch (err) {
    yield put(reqActivitiesError(err));
  }
};
