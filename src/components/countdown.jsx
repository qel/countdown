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
                    width: 480,
                    height: 160,
                    top: 220,
                    zIndex: 200,
                    textAlign: 'center',
                    fontFamily: 'Oldenburg',
                    position: 'absolute',
                    color: '#000',
                    mixBlendMode: 'difference'
                }}
            >
                <div
                    style={{
                        fontFamily: 'Faster One',
                        fontSize: '1.4em'
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
                <Dial radius={195} pos={props.hours} prevPos={props.prev.hours} max={24} />
                <Dial radius={160} pos={props.minutes} prevPos={props.prev.minutes} max={60} />
                <Dial radius={125} pos={props.seconds} prevPos={props.prev.seconds} max={60} />
                <Dial radius={90} pos={props.milliseconds} prevPos={props.prev.milliseconds} max={1000} />
            </div>
        );
    }
}

Countdown.propTypes = {
    dispatch: PropTypes.func.isRequired,
    places: PropTypes.number.isRequired,
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
