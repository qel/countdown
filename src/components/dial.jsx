import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import dial2d from './dial-2d';

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

class Dial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positionBuffer: null
        };
    }

    componentWillReceiveProps(nextProps) {
        const gl = nextProps.canvasContext3d;

        if (gl && this.state.positionBuffer === null) {
            console.log('--- initializing webgl for dial with radius', this.props.radius);

            const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
            const program = createProgram(gl, vertexShader, fragmentShader);

            const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.vertexAttribPointer(positionAttributeLocation, // lookup current ARRAY_BUFFER, binds pointer to positionBuffer
                2,          // size: 2 components per iteration (get x and y from buffer, leave the default z and w)
                gl.FLOAT,   // type: the data is 32-bit floats
                false,      // normalize: don't normalize the data
                0,          // stride: 0 = move forward size * sizeof(type) each iteration to get the next position
                0           // offset: 0 = start at the beginning of the buffer
            );

            gl.useProgram(program);

            this.setState({
                positionBuffer
            });
        }
    }

    render() {
        const props = this.props;
        const gl = props.canvasContext3d;

        if (!gl) {
            // fallback to 2d context if we don't have webgl
            if (!props.canvasContext) {
                // bail out of the canvas hasn't initialized yet
                return false;
            }
            return dial2d(props);
        }

        if (props.radius < 44) {
            console.log('bail');
            return false;
        }

        if (this.state.positionBuffer === null) {
            console.log('!!! empty positionBuffer !!!');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.positionBuffer);

        // three 2d points
        const positions = [
            0, 0,
            0, props.radius / 100,
            props.radius / 75, 0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        try {
            gl.drawArrays(
                gl.TRIANGLES,   // primitiveType
                0,              // offset
                3               // count: 3 pairs of x,y values
            );
        } catch (ex) {
            console.log('drawArrays failed', 'this.state.positionBuffer =');
            console.dir(this.state.positionBuffer);
        }







        return false;
    }
}

Dial.propTypes = {
    canvasContext: PropTypes.object,
    canvasContext3d: PropTypes.object,
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    forceFullRender: PropTypes.bool.isRequired,
    radius: PropTypes.number.isRequired,
    stroke: PropTypes.number.isRequired,
    pos: PropTypes.number.isRequired,
    prevPos: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    renderer: state.renderer,
    forceFullRender: state.forceFullRender
});

export default connect(mapStateToProps, null)(Dial);
