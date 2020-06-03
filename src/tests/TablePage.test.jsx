/* eslint-disable react/react-in-jsx-scope */
import React from 'preact/compat';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';

import store from '../store/store'
import TablePage from '../Components/TablePage';


jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: () => ({
    push: jest.fn()
  })
}));


test('should render TablePage correctly', () => {
  const wrapper = mount(<Provider store={store}><TablePage /></Provider>);
  expect(toJson(wrapper)).toMatchSnapshot();
});