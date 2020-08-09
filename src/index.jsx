import { h, render } from 'preact';
import './assets/favicon.ico';
import 'whatwg-fetch';

import App from './App';

render(<App />, document.getElementById('root'));