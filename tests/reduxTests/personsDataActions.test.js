import createSagaMiddlewate from 'redux-saga';
import configureStore from 'redux-mock-store';
import { watchFetchPersons } from "../../src/store/personsDataStore/personsDataActions";

require('jest-fetch-mock').enableMocks();

const sagaMiddleware = createSagaMiddlewate();
const mockStore = configureStore([sagaMiddleware]);


describe(" personData saga", () => {

    beforeEach(() => {
        fetch.mockResponse(JSON.stringify({ code: "1" }))
    })

    it('should execute personsData actions', (done) => {
        const store = mockStore({});
        sagaMiddleware.run(watchFetchPersons);

        const expectedActions = [
            { type: "FETCHED_PERSONS" },
            { type: "REQUEST_PERSONS" },
            { type: "REQUEST_PERSONS_SUCCEEDED", data: { code: "1" } }
        ];

        store.subscribe(() => {
            const actions = store.getActions();
            if (actions.length >= expectedActions.length) {
                expect(actions).toEqual(expectedActions);
                done();
            }
        });

        store.dispatch({ type: "FETCHED_PERSONS" });
    });
});