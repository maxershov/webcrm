/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
// import thunk from 'redux-thunk';
import createSagaMiddlewate from 'redux-saga';

import dayDataReducer from "./dayData/dayDataReducer";
import personReducer from "./allPersons/allPersonsReducer";
import activityReducer from "./activities/ActivitiesReducer";
import testDataReducer from "./personsDataStore/personsDataReducer";
import testDataDayReducer from "./dayDataStore/dayDataReducer";
import activitiesDataReducer from "./activitiesDataStore/activitiesDataReducer";


import rootSaga from "./root-saga";

const sagaMiddleware = createSagaMiddlewate();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}


const store = createStore(
  combineReducers({
    dayDataStore: dayDataReducer,
    personStore: personReducer,
    activityStore: activityReducer,
    testDataStore: testDataReducer,
    testDataDayStore: testDataDayReducer,
    activitiesDataStore: activitiesDataReducer
  }),
  compose(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);

export default store;