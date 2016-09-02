import * as types from './types';

export const setCanvas = (canvas) => ({
    type: types.SET_CANVAS,
    canvas
});

export const setCanvasSize = (canvasWidth, canvasHeight) => ({
    type: types.SET_CANVAS_SIZE,
    canvasWidth,
    canvasHeight
});

export const setTargetTime = (targetTime) => ({
    type: types.SET_TARGET_TIME,
    targetTime
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
