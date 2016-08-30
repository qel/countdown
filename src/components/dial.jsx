import {PropTypes} from 'react';

const Dial = (props) => {
    const ctx = props.canvas.getContext('2d');
    const r = props.radius;
    const pos = props.pos;
    const divisor = props.max;

    const startRad = 1.5 * Math.PI;
    const endRad = 3.5 * Math.PI;
    const x = 240;
    const y = 240;

    if (pos === oldPos) {
        return;
    }
    const rad = (1.5 + pos / divisor * 2) * Math.PI;
    if (oldPos < pos) {
        ctx.beginPath();
        ctx.arc(x, y, r, startRad, endRad);
        ctx.lineWidth = 30;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(51,51,51,0.67)';
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, r, rad, endRad);
    ctx.lineWidth = 35;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.stroke();

    return false;
};

Dial.propTypes = {
    canvas: PropTypes.object.isRequired,
    radius: PropTypes.number.isRequired,
    pos: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
};

export default Dial;
