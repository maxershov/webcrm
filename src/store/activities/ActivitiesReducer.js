import { activityData } from '../testData';

const initState = { data: JSON.stringify(activityData) };

export default function activityReducer(state = initState, action) {
  switch (action.type) {
    case 'CHANGE_ACTIVITY_DATA':
      return { ...state, data: action.data };
    default:
      return state;
  };
};