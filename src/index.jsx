import React, {Component, PropertyTypes} from 'react';
import ReactDOM from 'react-dom';
import Countdown from 'components/countdown';
import ConsoleEcho from 'components/console-echo';

ReactDOM.render(
    <div>
        <Countdown interval={40} places={2} />
        <br />
        <ConsoleEcho />
    </div>
    ,document.getElementById('app')
);
