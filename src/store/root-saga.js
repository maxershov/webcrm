import { all, call } from 'redux-saga/effects';

import { watchFetchPersons } from './personsDataStore/personsDataActions';
import { watchFetchDays, watchDateChange } from './dayDataStore/dayDataActions';
import { watchFetchActivities } from './activitiesDataStore/activitiesDataActions';
import {watchFetchProfile} from './profileStore/profileActions';

export default function* rootSaga() {
    yield all([
        call(watchFetchPersons),
        call(watchFetchDays),
        call(watchFetchActivities),
        call(watchDateChange),
        call(watchFetchProfile)
    ])
}