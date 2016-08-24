export const ANIMATION_RUNNING = 'ANIMATION_RUNNING';
export const DRAW_FRAME = 'DRAW_FRAME';
export const TICK = 'TICK';

export const animationRunning = () => ({
    type: ANIMATION_RUNNING
});

export const drawFrame = () => ({
    type: DRAW_FRAME
});

export const tick = () => ({
    type: TICK
});
