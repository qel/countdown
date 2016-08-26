import * as types from './types';

const initialState = {
    targetTime: 0,
    targetTimezone: '',
    localTimezone: '',
    animationRunning: false,
    delta: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    }
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_TARGET_TIME:
            return Object.assign({}, state, {
                targetTime: action.targetTime,
            });
        case types.SET_TARGET_TIMEZONE:
            return Object.assign({}, state, {
                targetTimezone: action.targetTimezone,
            });
        case types.SET_LOCAL_TIMEZONE:
            return Object.assign({}, state, {
                localTimezone: action.localTimezone,
            });
        case types.START_ANIMATION:
            return Object.assign({}, state, {
                animationRunning: true
            });
        case types.STOP_ANIMATION:
            return Object.assign({}, state, {
                animationRunning: false
            });
        case types.TICK:
            return Object.assign({}, state, {
                delta: {
                    days: (state.targetTime - action.now) / (1000 * 60 * 60 * 24) | 0,
                    hours: (state.targetTime - action.now) / (1000 * 60 * 60) % 24 | 0,
                    minutes: (state.targetTime - action.now) / (1000 * 60) % 60 | 0,
                    seconds: (state.targetTime - action.now) / 1000 % 60 | 0,
                    milliseconds: (state.targetTime - action.now) % 1000 | 0
                }
            });
        default:
            return state;
    }
};

export default reducer;
