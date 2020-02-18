import { all, call } from 'redux-saga/effects';

import { watchFetchPersons } from './testData/testDataActions';
import { watchFetchDays } from './testDataDay/testDataDayActions';

export default function* rootSaga() {
    yield all([
        call(watchFetchPersons),
        call(watchFetchDays)
    ])
}