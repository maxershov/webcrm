const initialState = {
  data: [],
  loading: true,
  error: false,
  errorMsg: ""
};

export default function personDataReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_PERSONS":
      return {
        data: [],
        loading: true,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_PERSONS_SUCCEEDED":
      return {
        data: action.data,
        loading: false,
        error: false,
        errorMsg: ""
      };
    case "REQUEST_PERSONS_FAILED":
      return {
        data: [],
        loading: false,
        error: true,
        errorMsg: action.err
      };
    case "LOADING_PERSON_DATA":
      return { ...state, loading: true }
    default:
      return state;
  }
}
