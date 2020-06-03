import createSagaMiddlewate from 'redux-saga';
import configureStore from 'redux-mock-store';
import { watchFetchProfile } from "../../store/profileStore/profileActions";

require('jest-fetch-mock').enableMocks();

const sagaMiddleware = createSagaMiddlewate();
const mockStore = configureStore([sagaMiddleware]);


describe('activitiesData saga test', () => {

    beforeEach(() => {
        fetch.mockResponse(JSON.stringify([{ name: "Test" }]))
    })

    it('should execute activitiesData actions', (done) => {
        const store = mockStore({});
        sagaMiddleware.run(watchFetchProfile);

        const expectedActions = [
            { type: "FETCHED_PROFILE", code: "1" },
            { type: "REQUEST_PROFILE" },
            { type: "REQUEST_PROFILE_SUCCEEDED", data: { name: "Test" } }
        ];

        store.subscribe(() => {
            const actions = store.getActions();
            if (actions.length >= expectedActions.length) {
                expect(actions).toEqual(expectedActions);
                done();
            }
        });

        store.dispatch({ type: "FETCHED_PROFILE", code: "1" });
    });
});