/* eslint-disable react/react-in-jsx-scope */
import {h} from 'preact';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Header from '../src/Components/Header';


jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));


test('should render Header menu', () => {
  const wrapper = shallow(<Header />);
  // console.log(wrapper.debug());
  expect(wrapper.find('.menu-container').exists()).toBe(true);
});


test('should toggle menu container', () => {
  const wrapper = mount(<Header />);
  wrapper.find('.burger-btn').simulate('click');
  expect(wrapper.find('.menu-container--open').exists()).toBe(true);
  expect(wrapper.find('.menu-container').exists()).toBe(false);
});

test('should render Header correctly', () => {
  const wrapper = mount(<Header />);
  expect(toJson(wrapper)).toMatchSnapshot();
});