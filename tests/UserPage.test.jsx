/* eslint-disable react/react-in-jsx-scope */
import {h} from 'preact';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';
import MockDate from 'mockdate';

import store from '../src/store/store'
import UserPage from '../src/Components/UserPage';


jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: () => ({
    push: jest.fn()
  })
}));


test('should render UserPage correctly', () => {
  MockDate.set('2000-01-01')
  const wrapper = mount(<Provider store={store}><UserPage /></Provider>);
  expect(toJson(wrapper)).toMatchSnapshot();
});