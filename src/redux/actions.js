import * as types from './types';

export const init = ({localTimezone, targetTime, targetTimezone}) => ({
    type: types.INIT,
    localTimezone,
    targetTime,
    targetTimezone
});

export const startAnimation = () => ({
    type: types.START_ANIMATION
});

export const stopAnimation = () => ({
    type: types.STOP_ANIMATION
});

export const tick = () => ({
    type: types.TICK
});
