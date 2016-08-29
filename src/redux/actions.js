import * as types from './types';

export const setTargetTime = (targetTime) => ({
    type: types.SET_TARGET_TIME,
    targetTime
});

export const setTargetTimezone = (targetTimezone) => ({
    type: types.SET_TARGET_TIMEZONE,
    targetTimezone
});

export const setLocalTimezone = (localTimezone) => ({
    type: types.SET_LOCAL_TIMEZONE,
    localTimezone
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
