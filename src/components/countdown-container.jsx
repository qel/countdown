import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Countdown} from './countdown';
import {setTargetTime, setTargetTimezone, setLocalTimezone, startAnimation, stopAnimation, tick} from '../redux/actions';

class CountdownContainer extends Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    startAnimation() {
        const {store} = this.context;

        const animation = () => {
            if (store.getState().animateStarted) {
                store.dispatch(tick());
                window.requestAnimationFrame(animation);
            }
        };

        store.dispatch(animationRunning());
    }

    render() {
        return (
            <Countdown
                {...state}
                startAnimation={::this.startAnimation}
            />
        );
    }
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

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setTargetTime: (targetTime) => {dispatch(setTargetTime(targetTime))},
//         setTargetTimezone: (targetTimezone) => {dispatch(setTargetTimezone(targetTimezone))},
//         setLocalTimezone: (localTimezone) => {dispatch(setLocalTimezone(localTimezone))},
//         startAnimation: () => {dispatch(startAnimation())},
//         stopAnimation: () => {dispatch(stopAnimation())},
//         tick: () => {dispatch(tick)}
//     };
// };

const mapDispatchToProps = {
    setTargetTime,
    setTargetTimezone,
    setLocalTimezone,
    startAnimation,
    stopAnimation,
    tick
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CountdownContainer);
