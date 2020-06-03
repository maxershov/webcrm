/* eslint-disable react/react-in-jsx-scope */
import React from 'preact/compat';
import { mount, shallow, render } from 'enzyme';
import toJson from 'enzyme-to-json';

import Header from '../Components/Header';


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

test('should render darkThemeBtn', () => {
  const wrapper = shallow(<Header />);
  const darkThemeBtn = wrapper.find('.darkThemeBtn');
  expect(darkThemeBtn.length).toBe(1);
});

test('should toggle menu container', () => {
  const wrapper = mount(<Header />);
  wrapper.find('#burgerBtn').simulate('click');
  expect(wrapper.find('.menu-container_open').exists()).toBe(true);
  expect(wrapper.find('.menu-container').exists()).toBe(false);
});

test('should render Header correctly', () => {
  const wrapper = mount(<Header />);
  expect(toJson(wrapper)).toMatchSnapshot();
});