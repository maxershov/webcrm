import { all, call } from 'redux-saga/effects';

import { watchFetchPersons } from './testData/testDataActions';

export default function* rootSaga() {
    yield all([
        call(watchFetchPersons)
    ])
}