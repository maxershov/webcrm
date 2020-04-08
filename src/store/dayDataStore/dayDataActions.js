import { takeLatest, put, call } from "redux-saga/effects";
import host from "../../../host";
import {sleep} from "../storeGetters";

export const reqDays = () => {
  return { type: "REQUEST_DAYS" };
};


export const reqDaysSucess = dayData => {
  return { type: "REQUEST_DAYS_SUCCEEDED", data: dayData };
};


export const reqDaysError = err => {
  return { type: "REQUEST_DAYS_FAILED", error: err };
};


export const fetchDays = (date) => {
  return { type: "FETCHED_DAYS", date };
};


export const changeNotes = (date, notes) => {
  return { type: "CHANGE_DATE_NOTES", date, notes };
};


export function* watchFetchDays() {
  yield takeLatest("FETCHED_DAYS", fetchDaysAsync);
  yield takeLatest("CHANGE_DATE_NOTES", changeNotesAsync);
};


function* fetchDaysAsync({ date }) {
  try {
    yield put(reqDays());
    yield sleep(1000);
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getDate/${date}`).then(res => res.json());
    });
    yield put(reqDaysSucess(data[0]));
  } catch (err) {
    yield put(reqDaysError(err));
  }
};


function* changeNotesAsync({ date, notes }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "day": date, "notes": notes })
  };
  try {
    yield put(reqDays());
    const updatedData = yield call(() => {
      return fetch(`http://${host.host}:6700/chgNotes`, requestOptions)
        .then(res => res.json());
    });
    yield put(reqDaysSucess(updatedData[0]));
  } catch (err) {
    yield put(reqDaysError(err));
  }
};
