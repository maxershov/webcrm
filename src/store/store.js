/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddlewate from 'redux-saga';

import personsDataReducer from "./personsDataStore/personsDataReducer";
import dayDataReducer from "./dayDataStore/dayDataReducer";
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
    activitiesStore: activitiesDataReducer,
    personsStore: personsDataReducer,
    dayStore:dayDataReducer,
  }),
  compose(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);

export default store;