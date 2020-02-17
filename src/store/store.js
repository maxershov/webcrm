/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import dayDataReducer from "./dayData/dayDataReducer";
import personReducer from "./allPersons/allPersonsReducer";
import activityReducer from "./activities/ActivitiesReducer";
import testDataReducer from "./testData/testDataReducer";

// const thunk = ReduxThunk.default;

const store = createStore(
  combineReducers({
    dayDataStore: dayDataReducer,
    personStore: personReducer,
    activityStore: activityReducer,
    testDataStore: testDataReducer
  }),
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
