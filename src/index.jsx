import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import reducer from './redux/reducer';
import Container from './components/container';
import Countdown from './components/countdown';
import NickCage from './components/nick-cage';
// import ConsoleEcho from './components/console-echo';

let store = creat

ReactDOM.render(
    <div>
        <Countdown interval={40} places={2} />
        <NickCage disabled />
    </div>
    , document.getElementById('app')
);
