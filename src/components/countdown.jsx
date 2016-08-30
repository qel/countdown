import React, {Component} from 'react';
import {connect} from 'react-redux';

import Dial from './dial';

var Countdown = (props) => {
    if (!props.targetTime) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                width: 480,
                height: 160,
                top: 220,
                zIndex: 200,
                textAlign: 'center',
                fontFamily: 'Oldenburg',
                position: 'absolute',
                color: '#fff',
                mixBlendMode: 'difference'
            }}
        >
            <div
                style={{
                    fontFamily: 'Faster One',
                    fontSize: '1.4em'
                }}
            >
                {this.state.days + ' days ' + this.state.hr + ' hr. ' + this.state.min + ' min. '
                    + (this.state.sec + this.state.ms / 1000).toFixed(this.props.places) + ' sec.'}
            </div>
            {this.state.past ? 'after' : 'until'}
            <br />
            {targetDateStr}
            <br />
            {targetTimeStr}
            &nbsp;
            {targetTZName}
            <br />
            {offsetMessage}
            <Dial canvas={props.canvas} radius={195} pos={props.hours} max={24} />
            <Dial canvas={props.canvas} radius={160} pos={props.minutes} max={60} />
            <Dial canvas={props.canvas} radius={125} pos={props.seconds} max={60} />
            <Dial canvas={props.canvas} radius={90} pos={props.milliseconds} max={1000} />
        </div>
    );
}

const mapStateToProps = (state) => ({
    targetTime: state.targetTime,
    targetTimezone: state.targetTimezone,
    localTimezone: state.localTimezone,
    animationRunning: state.animationRunning,
    days: state.delta.days,
    hours: state.delta.hours,
    minutes: state.delta.minutes,
    seconds: state.delta.seconds,
    milliseconds: state.delta.milliseconds
});

CountdownContainer = connect(mapStateToProps, null)(CountdownContainer);

export default CountdownContainer;
