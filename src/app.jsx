import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import reducer from './redux/reducer';
import AnimationRunner from './components/animation-runner';
import Countdown from './components/countdown';
import NickCage from './components/nick-cage';

ReactDOM.render(
    <Provider store={createStore(reducer, window.devToolsExtension && window.devToolsExtension())}>
        <AnimationRunner webglEnabled={false}>
            <Countdown places={2} />
            <NickCage disabled />
        </AnimationRunner>
    </Provider>
    , document.getElementById('app')
);
