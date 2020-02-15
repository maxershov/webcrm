/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers } from 'redux';
import dayDataReducer from './dayData/dayDataReducer';
import personReducer from './allPersons/allPersonsReducer';
import activityReducer from './activities/ActivitiesReducer';

const store = createStore(
  combineReducers({
    dayDataStore: dayDataReducer,
    personStore: personReducer,
    activityStore: activityReducer
  }), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


export default store;