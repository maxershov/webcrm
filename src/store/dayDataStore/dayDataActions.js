import { takeLatest, put, call } from "redux-saga/effects";
import { format } from "date-fns";

import host from "../../../host";

// function isToday(date) {
//   const todayDate = format(new Date(), "dd-MM-yyyy");
//   return todayDate === date;
// }

// function getDateObj(dateTo) {
//   console.log('getDateObj', dateTo);
//   const data = getDayDataStore();
//   const indexDate = data.findIndex(x => x.date === dateTo);
//   console.log('getDateObj', indexDate);
//   if (indexDate !== -1) {
//     return data[indexDate];
//   }
//   const newDateObj = { "date": dateTo, "notes": "", "history": [] };
//   console.log('add newDateObj in getDataObj', newDateObj);
//   addNewDayDataToJSON(newDateObj);
//   return newDateObj;
// }

export const reqDays = () => {
  return { type: "REQUEST_DAYS" };
};

export const reqDaysSucess = dayData => {
  console.log("REQ_DAYS_SUCESS", dayData);
  const todayDate = format(new Date(), "dd-MM-yyyy");
  const indexDate = dayData.findIndex(x => x.date === todayDate);
  console.log("indexData in REQ STORE", indexDate);
  console.log("data before IF in REQ STORE", dayData);
  if (indexDate === -1) {
    //  console.log('data before in REQ STORE', dayData);
    const newDateObj = { date: todayDate, notes: "", history: [] };
    dayData.push(newDateObj);
    console.log("data after in REQ STORE", dayData);
    // mb set this in server side??
    //save? if we doesn't change any data => we dont need this data in Db => if change => data will save from App.js
  }
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
    yield sleep(1000);
    const data = yield call(() => {
      return fetch(`http://${host.host}:6700/getday`).then(res => res.json());
    });
    yield put(reqDaysSucess(data));
  } catch (err) {
    yield put(reqDaysError(err));
  }
}



// function* handleInput({ input }) {
//   // debounce by 500ms
//   yield delay(500)
//   ...
// }

// function* watchInput() {
//   // will cancel current running handleInput task
//   yield takeLatest('INPUT_CHANGED', handleInput);
// }

export const changeDay = (dateTo) => {
  return { type: "CHANGE_DATE", dateTo };
};

function* handleDateChange ({dateTo}) {
  yield console.log("handle", dateTo);
}

export function* watchDateChange() {
  yield takeLatest('CHANGE_DATE', handleDateChange)
}

// export function* addDayAsync(dateTo) {
//   try {
//     yield console.log("addDayAsync", dateTo);
//     // yield 
//   } catch (err) {
//     yield put(reqDaysError(err));
//   }
// }



function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}