/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/react-in-jsx-scope */
import React from 'preact/compat';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';

import store from '../store/store'
import TablePageShort from '../Components/TablePageShort';


jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: { pathname: "test" }
  }),
  useParams: () => ({
    push: jest.fn()
  })
}));


test('should render TablePageShort correctly', () => {
  const wrapper = mount(<Provider store={store}><TablePageShort /></Provider>);
  expect(toJson(wrapper)).toMatchSnapshot();
});