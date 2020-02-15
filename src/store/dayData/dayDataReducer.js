import {dayData} from '../testData';

const initState = { data: JSON.stringify(dayData) };
export default function dayDataReducer(state = initState, action) {
    switch (action.type) {
        case 'CHANGE_DAY_DATA':
            return {...state, data: action.data };
        default:
            return state;
    };
};