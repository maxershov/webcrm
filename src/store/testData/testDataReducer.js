const initialState = {
  data: "",
  loading: true,
  error: false
};

export default function testDataReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_PERSONS":
      return {
        data: "",
        loading: true,
        error: false
      };
    case "GET_PERSONS":
      return {
        data: action.data,
        loading: false,
        error: false
      };
    case "REQUEST_PERSONS_FAILED":
      return {
        data: "",
        loading: false,
        error: true
      };
    default:
      return state;
  }
}
