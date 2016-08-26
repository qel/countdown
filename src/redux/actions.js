import * as types from './types';

export const animationRunning = () => ({
    type: type.ANIMATION_RUNNING
});

export const drawFrame = () => ({
    type: type.DRAW_FRAME
});

export const tick = () => ({
    type: type.TICK
});
