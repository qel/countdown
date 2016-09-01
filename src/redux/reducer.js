import * as types from './types';

const initialState = {
    canvas: null,
    targetTime: 0,
    animationRunning: true,
    delta: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    },
    prevDelta: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    },
    past: false
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CANVAS:
            console.log('--- setting canvas ---');
            console.dir(action.canvas);
            return Object.assign({}, state, {
                canvas: action.canvas
            });
        case types.SET_TARGET_TIME:
            return Object.assign({}, state, {
                targetTime: action.targetTime
            });
        case types.START_ANIMATION:
            return Object.assign({}, state, {
                animationRunning: true
            });
        case types.STOP_ANIMATION:
            return Object.assign({}, state, {
                animationRunning: false
            });
        case types.TICK: {
            const now = Date.now();
            return Object.assign({}, state, {
                past: state.targetTime - now > 0,
                delta: {
                    days: (state.targetTime - now) / (1000 * 60 * 60 * 24) | 0,
                    hours: (state.targetTime - now) / (1000 * 60 * 60) % 24 | 0,
                    minutes: (state.targetTime - now) / (1000 * 60) % 60 | 0,
                    seconds: (state.targetTime - now) / 1000 % 60 | 0,
                    milliseconds: (state.targetTime - now) % 1000 | 0
                },
                prevDelta: {
                    days: state.delta.days,
                    hours: state.delta.hours,
                    minutes: state.delta.minutes,
                    seconds: state.delta.seconds,
                    milliseconds: state.delta.milliseconds
                }
            });
        }
        default:
            return state;
    }
};

export default reducer;
