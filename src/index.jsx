import React from 'react';
import ReactDOM from 'react-dom';
import Countdown from './components/countdown';
// import ConsoleEcho from './components/console-echo';

ReactDOM.render(
    <div>
        <Countdown interval={40} places={2} />
    </div>
    , document.getElementById('app')
);
