import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {v4} from 'node-uuid';

import {registerVertexBuffer} from '../redux/actions';
import dial2d from './dial-2d';

const BUFFER_SIZE = 24; // 3 vertexes * 2 components (x,y) * 4 bytes (32-bit float) = 24

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

        // theta: position in radians
        const theta = ((props.pos / props.max) - 0.25) * pi * 2;
        const thetaNormal90 = theta + pi / 2;
        const thetaNormal270 = theta + pi + pi / 2;

        // three 2d points
        const r = props.radius / 100;

        const vertices = [
            (r / 10) * cos(thetaNormal270), (r / 10) * sin(thetaNormal270) * -1,
            r * cos(theta), r * sin(theta) * -1,
            (r / 10) * cos(thetaNormal90), (r / 10) * sin(thetaNormal90) * -1
        ];

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
