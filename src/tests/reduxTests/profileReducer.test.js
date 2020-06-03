import profileReducer from "../../store/profileStore/profileReducer";

const initialState = {
    data: [],
    loading: true,
    error: false,
    errorMsg: ""
};

const action = {};


test('should REQUEST_PROFILE', () => {
    const answer = profileReducer(initialState, action.type = "REQUEST_PROFILE");
    expect(answer.toString()).toBe({
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});


test('should REQUEST_PROFILE_SUCCEEDED', () => {
    action.date = { code: 1, name: "test" }
    const answer = profileReducer(initialState, action.type = "REQUEST_PROFILE_SUCCEEDED");
    expect(answer.toString()).toBe({
        data: [{ code: 1, name: "test" }],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});


test('should LOADING_PROFILE', () => {
    const answer = profileReducer(initialState, action.type = "LOADING_PROFILE");
    expect(answer.loading).toBe(true);
})

