/* eslint-disable react/jsx-filename-extension */
import React, {render} from 'preact/compat';
import './assets/favicon.ico';
import 'whatwg-fetch';

import App from './App';

render(<App />, document.getElementById('root'));