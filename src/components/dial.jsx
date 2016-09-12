import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {v4} from 'node-uuid';

import {registerVertexBuffer} from '../redux/actions';
import dial2d from './dial-2d';

const BUFFER_SIZE = 24; // 3 vertexes * 2 components * 4 bytes (32-bit float) = 24

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

        const attrib = props.attrib;

        if (attrib === -1 || props.bufferOffset === null) {
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

        gl.vertexAttribPointer(attrib, // lookup current ARRAY_BUFFER, binds attrib to its buffer
            2,              // size: 2 components per iteration (get x and y from buffer, leave the default z and w)
            gl.FLOAT,       // type: the data is 32-bit floats
            false,          // normalize: don't normalize the data
            0,              // stride: 0 = move forward size * sizeof(type) each iteration to get the next position
            bufferOffset    // offset: 0 = start at the beginning of the buffer
        );

        console.log('bufferSubData bufferOffset', bufferOffset, 'vertices', vertices.length);
        try {
            gl.bufferSubData(gl.ARRAY_BUFFER, bufferOffset, new Float32Array(vertices));
        } catch (ex) {
            console.log('bufferSubData failed', 'attrib', attrib);
        }

        // try {
        //     gl.drawArrays(
        //         gl.TRIANGLES,   // primitiveType
        //         bufferOffset,   // offset
        //         3               // count: 3 pairs of x,y values
        //     );
        // } catch (ex) {
        //     console.log('drawArrays failed', 'this.state.attrib =');
        //     console.dir(this.state.attrib);
        // }







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
    attrib: PropTypes.number.isRequired,
    bufferOffset: PropTypes.object,
    bufferAllocated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    renderer: state.renderer,
    forceFullRender: state.forceFullRender,
    attrib: state.attrib,
    bufferOffset: state.bufferOffset,
    bufferAllocated: state.bufferAllocated
});

export default connect(mapStateToProps, null)(Dial);
