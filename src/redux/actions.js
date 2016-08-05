export const DRAW_FRAME = 'DRAW_FRAME';
export const ANIMATION_STARTED = 'ANIMATION_STARTED';

export const drawFrame() {
    return {
        type: DRAW_FRAME
    };
}

export const animationStarted() {
    return {
        type: ANIMATION_STARTED
    };
}
