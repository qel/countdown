export const ANIMATION_STARTED = 'ANIMATION_STARTED';
export const DRAW_FRAME = 'DRAW_FRAME';
export const TICK = 'TICK';

export const animationStarted = () => ({
    type: ANIMATION_STARTED
});

export const drawFrame = () => ({
    type: DRAW_FRAME
});

export const tick = () => ({
    type: TICK
});
