import React from 'react';
import ReactDOM from 'react-dom';
import Countdown from './components/countdown';
// import ConsoleEcho from './components/console-echo';

ReactDOM.render(
    <div>
        <Countdown interval={40} places={2} />
        <img
            src="http://media.giphy.com/media/13KQ6e5IEwAKJ2/giphy.gif"
            alt="left Cage"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '480px',
                zIndex: 0
            }}
        >
        </img>
        <img
            src="http://media.giphy.com/media/FDUxpEiVkowaQ/giphy.gif"
            alt="right Cage"
            style={{
                position: 'absolute',
                top: `${480 - 213}px`,
                left: 0,
                width: '480px',
                zIndex: 0
            }}
        >
        </img>
    </div>
    , document.getElementById('app')
);
