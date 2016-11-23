import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {v4} from 'node-uuid';

import {registerVertexBuffer} from '../redux/actions';
import dial2d from './dial-2d';

const TRIANGLES = 180;
const BUFFER_SIZE = TRIANGLES * 24; // 3 vertices * 2 components (x,y) * 4 bytes (32-bit float) = 24

class Dial extends Component {
    constructor(props) {
        super(props);
        const uuid = v4();
        this.state = {uuid};
        props.dispatch(registerVertexBuffer(uuid, BUFFER_SIZE));
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

        if (props.bufferOffset === null) {
            // bail out if we're not initialized yet.
            return false;
        }

        const bufferOffset = props.bufferOffset[this.state.uuid];
        const bufferAllocated = props.bufferAllocated;

        if (bufferOffset === undefined || !bufferAllocated) {
            return false;
        }

        // Render!

        const sin = Math.sin;
        const cos = Math.cos;
        const pi = Math.PI;

        // three 2d points
        const r = props.radius / 80;

        // const vertices = [
        //     (r / 10) * cos(thetaNormal270), (r / 10) * sin(thetaNormal270) * -1,
        //     r * cos(theta), r * sin(theta) * -1,
        //     (r / 10) * cos(thetaNormal90), (r / 10) * sin(thetaNormal90) * -1
        // ];

        const vertices = [];

        for (let i = 0; i < TRIANGLES; i++) {
            // theta: position in radians
            const thetaA = ((props.pos / props.max) / TRIANGLES * i - 0.25) * pi * 2;
            const thetaB = ((props.pos / props.max) / TRIANGLES * (i + 1) - 0.25) * pi * 2;
            const thetaC = ((props.pos / props.max) / TRIANGLES * (i + 0.5) - 0.25) * pi * 2;

            vertices.push(...[
                r * cos(thetaA), r * sin(thetaA) * -1,
                r * cos(thetaB), r * sin(thetaB) * -1,
                (r * 0.8) * cos(thetaC), (r * 0.8) * sin(thetaC) * -1
            ]);
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, bufferOffset, new Float32Array(vertices));





        return false;
    }
}

Dial.propTypes = {
    radius: PropTypes.number.isRequired,
    stroke: PropTypes.number.isRequired,
    pos: PropTypes.number.isRequired,
    prevPos: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    // redux
    dispatch: PropTypes.func.isRequired,
    canvasContext: PropTypes.object,
    canvasContext3d: PropTypes.object,
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    forceFullRender: PropTypes.bool.isRequired,
    bufferOffset: PropTypes.object,
    bufferAllocated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    forceFullRender: state.forceFullRender,
    bufferOffset: state.bufferOffset,
    bufferAllocated: state.bufferAllocated
});

export default connect(mapStateToProps, null)(Dial);
