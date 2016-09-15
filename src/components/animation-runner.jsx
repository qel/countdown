import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {polyfill} from 'raf';
import ObjectAssign from 'es6-object-assign';

import {setCanvasContext, setCanvasContext3d, setCanvasSize, setBufferAllocated, tick} from '../redux/actions';

const VERTEX_SHADER_SRC = `
    // an attribute will receive data from a buffer
    attribute vec4 a_position;

    // all shaders have a main function
    void main() {

        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = a_position;
    }
`;

const FRAGMENT_SHADER_SRC = `
    // fragment shaders don't have a default precision so we need
    // to pick one. mediump is a good default
    precision mediump float;

    void main() {
        // gl_FragColor is a special variable a fragment shader
        // is responsible for setting
        gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
    }
`;

const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return false;
};

const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return false;
};

class AnimationRunner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            buffer: null,
            attrib: -1
        };

        this.getCanvasContext = ::this.getCanvasContext;
        this.getCanvasContext3d = ::this.getCanvasContext3d;
        this.resizeCanvas = ::this.resizeCanvas;
        this.animationLoop = ::this.animationLoop;

        if (!window.requestAnimationFrame) {
            polyfill();
        }
        if (!window.Object.assign) {
            ObjectAssign.polyfill();
        }

        document.body.style.overflow = 'hidden';
        window.addEventListener('resize', this.resizeCanvas, false);
    }

    componentDidMount() {
        this.resizeCanvas();
        this.animationLoop();
    }

    componentWillReceiveProps(nextProps) {
        const gl = nextProps.canvasContext3d;

        if (gl && !this.state.initialized) {

            // if we have the WebGL context, initialize things
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
            const program = createProgram(gl, vertexShader, fragmentShader);
            const buffer = gl.createBuffer();
            const attrib = gl.getAttribLocation(program, 'a_position');

            // Set clear color to transparent
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            // Enable depth testing
            gl.enable(gl.DEPTH_TEST);
            // Near things obscure far things
            gl.depthFunc(gl.LEQUAL);

            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(attrib, // lookup current ARRAY_BUFFER, binds attrib to its buffer
                2,              // size: 2 components per iteration (get x and y from buffer, leave the default z and w)
                gl.FLOAT,       // type: the data is 32-bit floats
                false,          // normalize: don't normalize the data
                0,              // stride: 0 = move forward size * sizeof(type) each iteration to get the next position
                0               // offset: 0 = start at the beginning of the buffer
            );
            gl.enableVertexAttribArray(attrib);

            this.setState({
                initialized: true,
                attrib,
                buffer
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.initialized && nextProps.bufferSize > 0 && !nextProps.bufferAllocated) {

            // The vertex buffer needs allocated (or re-allocated).
            const gl = nextProps.canvasContext3d;
            const vertices = new Array(nextProps.bufferSize / 4).fill(0);

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            nextProps.dispatch(setBufferAllocated());
        }
    }

    getCanvasContext(canvas) {
        if (canvas && !this.props.canvasContext) {
            this.props.dispatch(setCanvasContext(canvas.getContext('2d')));
        }
    }

    getCanvasContext3d(canvas) {
        if (this.props.webglEnabled) {
            if (this.props.canvasContext3d) {
                // if we're re-rendering and we already have our context,
                // this is probably a resize, so set the viewport dimensions
                const gl = this.props.canvasContext3d;

                gl.viewport(0, 0, this.props.canvasWidth, this.props.canvasHeight);
            } else {
                // if we don't have the context yet, set it (if canvas is available)
                if (canvas) {
                    const gl = canvas.getContext('webgl', {
                        preserveDrawingBuffer: true
                    });

                    this.props.dispatch(setCanvasContext3d(gl));
                    gl.viewport(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
                }
            }
        }
    }

    resizeCanvas() {
        this.props.dispatch(setCanvasSize(document.documentElement.clientWidth, document.documentElement.clientHeight));
    }

    animationLoop() {
        if (this.props.animationRunning) {
            const gl = this.props.canvasContext3d;
            const bufferSize = this.props.bufferSize;
            if (gl && bufferSize > 0) {
                // Clear the color as well as the depth buffer.
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                gl.drawArrays(
                    gl.TRIANGLES,   // primitiveType
                    0,              // offset
                    bufferSize / 8  // count: 4-byte floats in (x,y) pairs
                );
            }
            this.props.dispatch(tick());
        }
        window.requestAnimationFrame(this.animationLoop);
    }

    render() {
        let webglCanvas = null;

        if (this.props.webglEnabled) {
            webglCanvas = (
                <canvas
                    ref={(c) => {this.getCanvasContext3d(c);}}
                    width={this.props.canvasWidth}
                    height={this.props.canvasHeight}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 400
                    }}
                />
            );
        }

        return (
            <div>
                <canvas
                    ref={(c) => {this.getCanvasContext(c);}}
                    width={this.props.canvasWidth}
                    height={this.props.canvasHeight}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 200
                    }}
                />
                {webglCanvas}
                {this.props.children}
            </div>
        );
    }
}

AnimationRunner.propTypes = {
    webglEnabled: PropTypes.bool,
    children: PropTypes.any,
    // redux
    dispatch: PropTypes.func.isRequired,
    canvasContext: PropTypes.object,
    canvasContext3d: PropTypes.object,
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    animationRunning: PropTypes.bool.isRequired,
    bufferSize: PropTypes.number.isRequired,
    bufferAllocated: PropTypes.bool.isRequired
};

AnimationRunner.defaultProps = {
    webglEnabled: true
};

const mapStateToProps = (state) => ({
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    animationRunning: state.animationRunning,
    bufferSize: state.bufferSize,
    bufferAllocated: state.bufferAllocated
});

export default connect(mapStateToProps, null)(AnimationRunner);
