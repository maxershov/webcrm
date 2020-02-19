const initialState = {
  data: [],
  loading: true,
  error: false,
  errorMsg: ""
};

export default function testDataDayReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_DAYS":
      return {
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_DAYS_SUCCEEDED":
      return {
        data: action.data,
        loading: false,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_DAYS_FAILED":
      return {
        data: [],
        loading: false,
        error: true,
        errorMsg: action.err
      };
    case "CHANGE_DAY_DATA":
      return { ...state, data: action.data };
    // case "ADD_DAY_DATA":
    //   // [{"date":"20-02-2020","notes":"20 тест","history":[{"code":"TEST1", "time":"10:01:45"}]}]
    //   return {...state, ...[{"date":action.day, "notes":"", "history":[]}]}
    default:
      return state;
  }
}
