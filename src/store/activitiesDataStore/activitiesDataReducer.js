const initialState = {
  data: [],
  loading: false,
  error: false,
  errorMsg: ""
};

export default function activitiesDataReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_ACTIVITIES":
      return {
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_ACTIVITIES_SUCCEEDED":
      return {
        data: action.data,
        loading: false,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_ACTIVITIES_FAILED":
      return {
        data: [],
        loading: false,
        error: true,
        errorMsg: action.err
      };
    case "CHANGE_ACTIVITIES_DATA":
      return { ...state, data: action.data };
    default:
      return state;
  }
}
