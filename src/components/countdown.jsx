import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import initializeCountdown from '../util/initialize-countdown';
import {setTargetTime} from '../redux/actions';
import Dial from './dial';

class Countdown extends Component {
    constructor(props) {
        super(props);
        this.state = initializeCountdown();
        props.dispatch(setTargetTime(this.state.targetTime));
    }

    render() {
        const props = this.props;
        const componentState = this.state;

        return (
            <div
                style={{
                    width: props.canvasWidth,
                    height: 160,
                    top: props.canvasHeight / 2 - 42,
                    zIndex: 200,
                    textAlign: 'center',
                    fontFamily: 'Oldenburg',
                    fontSize: `${100 / 500 * props.canvasWidth}%`,
                    position: 'absolute',
                    color: '#000'
                }}
            >
                <div
                    style={{
                        fontFamily: 'Faster One',
                        fontSize: `${100 / 600 * (props.canvasWidth ** 0.8)}px`
                    }}
                >
                    {props.days + ' days ' + props.hours + ' hr. ' + props.minutes + ' min. '
                        + (props.seconds + props.milliseconds / 1000).toFixed(props.places) + ' sec.'}
                </div>
                {props.past ? 'after' : 'until'}
                <br />
                {componentState.targetDateStr}
                <br />
                {componentState.targetTimeStr}
                &nbsp;
                {componentState.targetTZName}
                <br />
                {componentState.offsetMessage}
                <Dial radius={44} stroke={6} pos={props.hours} prevPos={props.prev.hours} max={24} />
                <Dial radius={36} stroke={6} pos={props.minutes} prevPos={props.prev.minutes} max={60} />
                <Dial radius={28} stroke={6} pos={props.seconds} prevPos={props.prev.seconds} max={60} />
                <Dial radius={20} stroke={6} pos={props.milliseconds} prevPos={props.prev.milliseconds} max={1000} />
            </div>
        );
    }
}

Countdown.propTypes = {
    dispatch: PropTypes.func.isRequired,
    places: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    animationRunning: PropTypes.bool.isRequired,
    days: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    milliseconds: PropTypes.number.isRequired,
    prev: PropTypes.object.isRequired,
    past: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    animationRunning: state.animationRunning,
    days: state.delta.days,
    hours: state.delta.hours,
    minutes: state.delta.minutes,
    seconds: state.delta.seconds,
    milliseconds: state.delta.milliseconds,
    prev: {
        days: state.prevDelta.days,
        hours: state.prevDelta.hours,
        minutes: state.prevDelta.minutes,
        seconds: state.prevDelta.seconds,
        milliseconds: state.prevDelta.milliseconds
    },
    past: state.past
});

export default connect(mapStateToProps, null)(Countdown);
