import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import reducer from './redux/reducer';
import CountdownContainer from './components/countdown-container';
import NickCage from './components/nick-cage';

ReactDOM.render(
    <Provider store={createStore(reducer)}>
        <CountdownContainer store={store} places={2} />
        <NickCage disabled />
    </Provider>
    , document.getElementById('app')
);
