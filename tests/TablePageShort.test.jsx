/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/react-in-jsx-scope */
import React from 'preact/compat';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';

import store from '../src/store/store'
import TablePageShort from '../src/Components/TablePageShort';


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