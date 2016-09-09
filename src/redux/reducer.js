import * as types from './types';

const initialState = {
    canvasContext: null,
    canvasContext3d: null,
    canvasWidth: 0,
    canvasHeight: 0,
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
    past: false,
    forceFullRender: false,
    attrib: null,
    bufferSize: 0,
    bufferOffset: null
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CANVAS_CONTEXT:
            return Object.assign({}, state, {
                canvasContext: action.canvasContext
            });
        case types.SET_CANVAS_CONTEXT_3D:
            return Object.assign({}, state, {
                canvasContext3d: action.canvasContext3d
            });
        case types.SET_CANVAS_SIZE:
            return Object.assign({}, state, {
                canvasWidth: action.canvasWidth,
                canvasHeight: action.canvasHeight
            });
        case types.SET_RENDERER:
            return Object.assign({}, state, {
                renderer: action.renderer
            });
        case types.SET_TARGET_TIME:
            return Object.assign({}, state, {
                targetTime: action.targetTime
            });
        case types.SET_ATTRIB:
            return Object.assign({}, state, {
                attrib: action.attrib
            });
        case types.REGISTER_VERTEX_BUFFER:
            return Object.assign({}, state, {
                bufferSize: state.bufferSize + action.bufferSize
                bufferOffset: Object.assign({}, state.bufferOffset, {
                    action.uuid: state.bufferSize
                })
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
            const ms = state.targetTime - Date.now();
            return Object.assign({}, state, {
                delta: {
                    days: ms / (1000 * 60 * 60 * 24) | 0,
                    hours: ms / (1000 * 60 * 60) % 24 | 0,
                    minutes: ms / (1000 * 60) % 60 | 0,
                    seconds: ms / 1000 % 60 | 0,
                    milliseconds: ms % 1000 | 0
                },
                prevDelta: {
                    days: state.delta.days,
                    hours: state.delta.hours,
                    minutes: state.delta.minutes,
                    seconds: state.delta.seconds,
                    milliseconds: state.delta.milliseconds
                },
                past: ms < 0,
                forceFullRender: false
            });
        }
        case types.FORCE_FULL_RENDER: {
            return Object.assign({}, state, {
                forceFullRender: true
            });
        }
        default:
            return state;
    }
};

export default reducer;
