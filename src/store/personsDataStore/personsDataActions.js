import { takeLatest, put, call, select } from "redux-saga/effects";



export const getStatePersonData = state => state.personsStore.data


export const reqPersons = () => {
  return { type: "REQUEST_PERSONS" };
};


export const setLoading = () => {
  return { type: "LOADING_PERSON_DATA" };
}


export const reqPersonsSuccess = personsData => {
  return { type: "REQUEST_PERSONS_SUCCEEDED", data: personsData };
};


export const pushNewPerson = (newPerson) => {
  return { type: "PUSH_NEW_PERSON", newPerson };
}


export const reqPersonsError = err => {
  return { type: "REQUEST_PERSONS_FAILED", error: err };
};


export const fetchPersons = () => {
  return { type: "FETCHED_PERSONS" };
};



function* fetchPersonsAsync() {
  try {
    yield put(reqPersons());
    // yield sleep(1000)
    const data = yield call(() => {
      return fetch(`/getPersons`).then(res =>
        res.json()
      );
    });
    yield put(reqPersonsSuccess(data));

  } catch (err) {
    yield put(reqPersonsError(err));
  }
}


// LET'S THE MAGIC BEGINS !!!
export function* pushNewPersonAsync({ newPerson }) {
  yield put(setLoading());
  const data = yield select(getStatePersonData);
  const updData = yield data.concat(newPerson);
  yield put(reqPersonsSuccess(updData));
};

export function* watchFetchPersons() {
  yield takeLatest("FETCHED_PERSONS", fetchPersonsAsync);
  yield takeLatest("PUSH_NEW_PERSON", pushNewPersonAsync);
}