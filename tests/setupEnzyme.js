/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import { Adapter } from 'enzyme-adapter-preact-pure';
import 'regenerator-runtime/runtime'

Enzyme.configure({ adapter: new Adapter() });