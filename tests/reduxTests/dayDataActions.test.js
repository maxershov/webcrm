import createSagaMiddlewate from 'redux-saga';
import configureStore from 'redux-mock-store';
import { watchFetchDays } from "../../src/store/dayDataStore/dayDataActions";

require('jest-fetch-mock').enableMocks();

const sagaMiddleware = createSagaMiddlewate();
const mockStore = configureStore([sagaMiddleware]);


describe('dayData saga test', () => {

    beforeEach(() => {
        fetch.mockResponse(JSON.stringify([{ date: "10-10-2000" }])
        )
    });

    it('should execute dayData actions', (done) => {
        const store = mockStore({});
        sagaMiddleware.run(watchFetchDays);

        const expectedActions = [
            { type: "FETCHED_DAYS", date: "10-10-2000" },
            { type: "REQUEST_DAYS" },
            { type: "REQUEST_DAYS_SUCCEEDED", data: { "date": "10-10-2000" } }
        ];

        store.subscribe(() => {
            const actions = store.getActions();
            if (actions.length >= expectedActions.length) {
                expect(actions).toEqual(expectedActions);
                done();
            }
        });

        store.dispatch({ type: "FETCHED_DAYS", date: "10-10-2000" });
    });
});