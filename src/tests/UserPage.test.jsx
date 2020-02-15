import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { UserPage, PersonParams, LeadParams, LostPersonParams, EmployeeParams } from '../Components/UserPage'
import { person, lead, employee, lost } from './testData/testData'


// Set mock for router func => get url for navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    codeLink: '111111',
  }),
}));

// Set default date to make all snapshots equal
const defaultDate = new Date(0);
jest.spyOn(global, 'Date').mockImplementation(() => defaultDate);


test('should render UserPage person correctly', () => {
  const wrapper = shallow(<UserPage personData={JSON.stringify(person)} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('should render PersonParams correctly', () => {
  const wrapper = shallow(<PersonParams person={JSON.stringify(person[0])} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});


test('should render LeadParams correctly', () => {
  const wrapper = shallow(<LeadParams person={JSON.stringify(lead[0])} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('should render LostPersonParams correctly', () => {
  const wrapper = shallow(<LostPersonParams person={JSON.stringify(lost[0])} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('should render EmployeeParams correctly', () => {
  const wrapper = shallow(<EmployeeParams person={JSON.stringify(employee[0])} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});