const dial2d = (props) => {
    const ctx = props.canvasContext;
    const canvasMin = Math.min(props.canvasWidth, props.canvasHeight);
    const r = canvasMin * (props.radius / 100);
    const lineWidth = canvasMin * (props.stroke / 100);
    const pos = props.pos;
    const oldPos = props.prevPos;
    const divisor = props.max;

    if (pos === oldPos && !props.forceFullRender) {
        return false;
    }

    const startRad = -0.5 * Math.PI; // -90 deg
    const endRad = 1.5 * Math.PI; // +270 deg
    const x = props.canvasWidth / 2;
    const y = props.canvasHeight / 2;
    const rad = (-0.5 + (pos / divisor) * 2) * Math.PI;

    if (oldPos < pos || props.forceFullRender) {
        // redraw a fully-solid dial
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = '#888';
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
        if (props.forceFullRender) {
            console.log('forceFullRender radius', props.radius, 'pos', pos, 'oldPos', oldPos);
            console.log('startRad', startRad, 'endRad', endRad, 'rad', rad);
        }
    }
    // clear the white part of the dial
    // TODO: is it faster for us to calculate the oldRad here and only clear what we need to?
    ctx.beginPath();
    ctx.lineWidth = lineWidth + 2;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#fff';
    ctx.arc(x, y, r, rad, endRad);
    ctx.stroke();

    return false;
};

export default dial2d;
