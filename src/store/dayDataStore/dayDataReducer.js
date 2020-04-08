const initialState = {
  data: [],
  loading: true,
  error: false,
  errorMsg: ""
};

export default function dayDataReducer(state = initialState, action) {
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
    default:
      return state;
  }
}
