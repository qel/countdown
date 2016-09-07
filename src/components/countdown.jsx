import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import initializeCountdown from '../util/initialize-countdown';
import {setTargetTime, forceFullRender} from '../redux/actions';
import Dial from './dial';

class Countdown extends Component {
    constructor(props) {
        super(props);
        this.state = initializeCountdown();
        props.dispatch(setTargetTime(this.state.targetTime));
    }

    componentDidUpdate(prevProps) {
        const props = this.props;

        if (prevProps.canvasHeight !== props.canvasHeight || prevProps.canvasWidth !== props.canvasWidth) {
            const ctx = props.canvasContext;
            const gl = props.canvasContext3d;

            // When the size changes we clear the canvas...
            if (ctx) {
                ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
            }
            if (gl) {
                // Set clear color to black, fully opaque
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                // Enable depth testing
                gl.enable(gl.DEPTH_TEST);
                // Near things obscure far things
                gl.depthFunc(gl.LEQUAL);
                // Clear the color as well as the depth buffer.
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            }

            // Then we'll force the actual drawing components to rerender.
            props.dispatch(forceFullRender());
        }
    }

    render() {
        const props = this.props;
        const componentState = this.state;

        let offsetMessage = null;
        if (componentState.offsetMessage) {
            offsetMessage = (
                <span style={{fontSize: `${65 / 500 * props.canvasWidth}%`}}>
                    &nbsp;
                    ({componentState.offsetMessage})
                </span>
            );
        }

        return (
            <div
                style={{
                    width: props.canvasWidth,
                    height: 160,
                    top: props.canvasHeight / 2 - 42,
                    zIndex: 300,
                    textAlign: 'center',
                    fontFamily: 'Oldenburg',
                    fontSize: `${100 / 500 * props.canvasWidth}%`,
                    position: 'absolute',
                    color: '#808'
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
                {offsetMessage}
                <Dial radius={44} stroke={6} pos={props.hours} prevPos={props.prev.hours} max={24} />
                <Dial radius={36} stroke={6} pos={props.minutes} prevPos={props.prev.minutes} max={60} />
                <Dial radius={28} stroke={6}pos={props.seconds} prevPos={props.prev.seconds} max={60} />
                <Dial radius={20} stroke={6} pos={props.milliseconds} prevPos={props.prev.milliseconds} max={1000} />
            </div>
        );
    }
}

Countdown.propTypes = {
    places: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
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
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
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
