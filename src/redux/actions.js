import * as types from './types';

export const setCanvasContext = (canvasContext) => ({
    type: types.SET_CANVAS_CONTEXT,
    canvasContext
});

export const setCanvasContext3d = (canvasContext3d) => ({
    type: types.SET_CANVAS_CONTEXT_3D,
    canvasContext3d
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
