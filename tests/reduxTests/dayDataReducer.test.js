import dayDataReducer from "../../src/store/dayDataStore/dayDataReducer";

const initialState = {
    data: [],
    loading: true,
    error: false,
    errorMsg: ""
};

const action = {};


test('should REQUEST_DAYS', () => {
    const answer = dayDataReducer(initialState, action.type = "REQUEST_DAYS");
    expect(answer.toString()).toBe({
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});


test('should REQUEST_DAYS_SUCCEEDED', () => {
    action.date = { code: 1, name: "test" }
    const answer = dayDataReducer(initialState, action.type = "REQUEST_DAYS_SUCCEEDED");
    expect(answer.toString()).toBe({
        data: [{ code: 1, name: "test" }],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});

