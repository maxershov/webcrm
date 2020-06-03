import activitiesDataReducer from "../../store/activitiesDataStore/activitiesDataReducer";

const initialState = {
    data: [],
    loading: true,
    error: false,
    errorMsg: ""
};

const action = {};


test('should REQUEST_ACTIVITIES', () => {
    const answer = activitiesDataReducer(initialState, action.type = "REQUEST_ACTIVITIES");
    expect(answer.toString()).toBe({
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});


test('should REQUEST_ACTIVITIES_SUCCEEDED', () => {
    action.date = { code: 1, name: "test" }
    const answer = activitiesDataReducer(initialState, action.type = "REQUEST_ACTIVITIES_SUCCEEDED");
    expect(answer.toString()).toBe({
        data: [{ code: 1, name: "test" }],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});

