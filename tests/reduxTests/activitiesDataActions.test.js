import createSagaMiddlewate from 'redux-saga';
import configureStore from 'redux-mock-store';
import { watchFetchActivities } from "../../src/store/activitiesDataStore/activitiesDataActions";

require('jest-fetch-mock').enableMocks();

const sagaMiddleware = createSagaMiddlewate();
const mockStore = configureStore([sagaMiddleware]);


describe('activitiesData saga test', () => {

    beforeEach(() => {
        fetch.mockResponse(JSON.stringify({ activity: "Test" }))
    })

    it('should execute activitiesData actions', (done) => {
        const store = mockStore({});
        sagaMiddleware.run(watchFetchActivities);

        const expectedActions = [
            { type: "FETCHED_VISIT_ACTIVITIES" },
            { type: "REQUEST_ACTIVITIES" },
            { type: "REQUEST_ACTIVITIES_SUCCEEDED", data: { activity: "Test" } }
        ];

        store.subscribe(() => {
            const actions = store.getActions();
            if (actions.length >= expectedActions.length) {
                expect(actions).toEqual(expectedActions);
                done();
            }
        });

        store.dispatch({ type: "FETCHED_VISIT_ACTIVITIES" });
    });
});