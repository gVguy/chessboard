import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app.js';
import './index.css';

import { createStore } from 'redux';
import { gameReducer } from './gameReducer.js';
import { Provider } from 'react-redux';


const store = createStore(gameReducer);


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));


