import personDataReducer from "../../store/personsDataStore/personsDataReducer";

const initialState = {
    data: [],
    loading: true,
    error: false,
    errorMsg: ""
};

const action = {};


test('should REQUEST_PERSONS', () => {
    const answer = personDataReducer(initialState, action.type = "REQUEST_PERSONS");
    expect(answer.toString()).toBe({
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});


test('should REQUEST_PERSONS_SUCCEEDED', () => {
    action.date = { code: 1, name: "test" }
    const answer = personDataReducer(initialState, action.type = "REQUEST_PERSONS_SUCCEEDED");
    expect(answer.toString()).toBe({
        data: [{ code: 1, name: "test" }],
        loading: true,
        error: false,
        errorMsg: ""
    }.toString());
});


test('should LOADING_PERSON_DATA', () => {
    const answer = personDataReducer(initialState, action.type = "LOADING_PERSON_DATA");
    expect(answer.loading).toBe(true);
})

