import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MainPage } from '../Components/MainPage'
import { persons } from './testData/testData'

// Set mock for router func => get url for navigation
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

// Set default date to make all snapshots equal
const defaultDate = new Date(0);
jest.spyOn(global, 'Date').mockImplementation(() => defaultDate);


test('should render MainPage correctly', () => {
  const wrapper = shallow(<MainPage personData={JSON.stringify(persons)} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});