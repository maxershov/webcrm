import { personData } from '../testData';

const initialState = { data: JSON.stringify(personData) };

export default function personReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_PERSON_DATA':
      return { ...state, data: action.data };
    case 'LOAD_PERSON_DATA':
      return { ...state, data: [] };
    default:
      return state;
  };
};