const initialState = {
  data: [],
  loading: true,
  error: false,
  errorMsg: ""
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_PROFILE":
      return {
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_PROFILE_SUCCEEDED":
      return {
        data: action.data,
        loading: false,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_PROFILE_FAILED":
      return {
        data: [],
        loading: false,
        error: true,
        errorMsg: action.err
      };
    case "CHANGE_PROFILE_DATA":
      return { ...state, data: action.data, loading: false }
    case "LOADING_PROFILE":
      return { ...state, loading: true }
    default:
      return state;
  }
}