import {connect} from 'react-redux';

import {Countdown} from './countdown';
import {init, startAnimation, stopAnimation, tick} from '../redux/actions';
import initializeCountdown from '../util/initializeCountdown';

var CountdownContainer = (props) => {
    if (!props.targetTime) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <Countdown
            {...state}
            startAnimation={::this.startAnimation}
        />
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
