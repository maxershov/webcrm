/* eslint-disable react/react-in-jsx-scope */
import {h} from 'preact';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';

import store from '../src/store/store'
import TablePage from '../src/Components/TablePage';


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