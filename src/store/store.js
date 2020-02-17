/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware , compose} from "redux";
import thunk from 'redux-thunk';
// import createSagaMiddlewate from 'redux-saga';
import dayDataReducer from "./dayData/dayDataReducer";
import personReducer from "./allPersons/allPersonsReducer";
import activityReducer from "./activities/ActivitiesReducer";
import testDataReducer from "./testData/testDataReducer";

// import watchPersons from './testData/testDataActions';

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}


const store = createStore(
  combineReducers({
    dayDataStore: dayDataReducer,
    personStore: personReducer,
    activityStore: activityReducer,
    testDataStore: testDataReducer
  }),
  compose(applyMiddleware(...middlewares))
);

export default store;



// /* eslint-disable no-underscore-dangle */
// import { createStore, combineReducers, applyMiddleware , compose} from "redux";
// // import thunk from 'redux-thunk';
// import createSagaMiddlewate from 'redux-saga';
// import dayDataReducer from "./dayData/dayDataReducer";
// import personReducer from "./allPersons/allPersonsReducer";
// import activityReducer from "./activities/ActivitiesReducer";
// import testDataReducer from "./testData/testDataReducer";

// import watchPersons from './testData/testDataActions';

// // const thunk = ReduxThunk.default;
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const sagaMiddleware = createSagaMiddlewate();


// const store = createStore(
//   combineReducers({
//     dayDataStore: dayDataReducer,
//     personStore: personReducer,
//     activityStore: activityReducer,
//     testDataStore: testDataReducer
//   }),
//   composeEnhancers(
//   // applyMiddleware(thunk)
//   applyMiddleware(sagaMiddleware)
//   )
//   // applyMiddleware(thunk)
//   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );
// sagaMiddleware.run(watchPersons)

// export default store;
