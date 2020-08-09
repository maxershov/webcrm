/* eslint-disable react/react-in-jsx-scope */
import {h} from 'preact';
import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json';
import MockDate from 'mockdate';

import store from '../src/store/store'
import MainPage from '../src/Components/MainPage';


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