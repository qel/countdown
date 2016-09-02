import {PropTypes} from 'react';
import {connect} from 'react-redux';

const Dial = (props) => {
    if (!props.canvas) {
        return false;
    }

    const ctx = props.canvas.getContext('2d');
    const r = props.radius;
    const pos = props.pos;
    const oldPos = props.prevPos;
    const divisor = props.max;

    if (pos === oldPos) {
        return false;
    }

    const startRad = 1.5 * Math.PI;
    const endRad = 3.5 * Math.PI;
    const x = 240;
    const y = 240;
    const rad = (1.5 + pos / divisor * 2) * Math.PI;

    if (oldPos < pos) {
        // if the dial has cycled (i.e., oldPos = 1 sec, new pos = 59 sec)
        if (oldPos > 0) {
            // if oldPos wasn't zero, we still have some of the old dial to clear
            ctx.beginPath();
            ctx.arc(x, y, r, startRad, rad);
            ctx.lineWidth = 35;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
        // redraw a fully-solid dial
        ctx.beginPath();
        ctx.arc(x, y, r, startRad, endRad);
        ctx.lineWidth = 30;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(51,51,51,0.67)';
        ctx.stroke();
    }
    // clear the white part of the dial
    // TODO: is it faster for us to calculate the oldRad here and only clear what we have to?
    ctx.beginPath();
    ctx.arc(x, y, r, rad, endRad);
    ctx.lineWidth = 35;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.stroke();

    return false;
};

Dial.propTypes = {
    canvas: PropTypes.object,
    radius: PropTypes.number.isRequired,
    pos: PropTypes.number.isRequired,
    prevPos: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    canvas: state.canvas
});

export default connect(mapStateToProps, null)(Dial);
