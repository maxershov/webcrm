/* eslint-disable react/react-in-jsx-scope */
import React from 'preact/compat';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';
import MockDate from 'mockdate';

import store from '../store/store'
import MainPage from '../Components/MainPage';


jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: () => ({
    push: jest.fn()
  })
}));


test('should render MainPage correctly', () => {
  MockDate.set('2000-01-01')
  const wrapper = mount(<Provider store={store}><MainPage /></Provider>);
  expect(toJson(wrapper)).toMatchSnapshot();
});