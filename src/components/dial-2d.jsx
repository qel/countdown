const dial2d = (props) => {
    const ctx = props.canvasContext;
    const canvasMin = Math.min(props.canvasWidth, props.canvasHeight);
    const r = canvasMin * props.radius / 100;
    const lineWidth = canvasMin * props.stroke / 100;
    const pos = props.pos;
    const oldPos = props.prevPos;
    const divisor = props.max;

    if (pos === oldPos && !props.forceFullRender) {
        return false;
    }

    const startRad = 1.5 * Math.PI;
    const endRad = 3.5 * Math.PI;
    const x = props.canvasWidth / 2;
    const y = props.canvasHeight / 2;
    const rad = (1.5 + pos / divisor * 2) * Math.PI;

    if (oldPos < pos || props.forceFullRender) {
        // if the dial has cycled (i.e., oldPos = 1 sec, new pos = 59 sec)
        if (oldPos > 0) {
            // if oldPos wasn't zero, we still have some of the old dial to clear
            ctx.beginPath();
            ctx.arc(x, y, r, startRad, rad);
            ctx.lineWidth = lineWidth + 2;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
        // redraw a fully-solid dial
        ctx.beginPath();
        ctx.arc(x, y, r, startRad, endRad);
        ctx.lineWidth = lineWidth;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(51,51,51,0.67)';
        ctx.stroke();
    }
    // clear the white part of the dial
    // TODO: is it faster for us to calculate the oldRad here and only clear what we need to?
    ctx.beginPath();
    ctx.arc(x, y, r, rad, endRad);
    ctx.lineWidth = lineWidth + 2;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.stroke();

    return false;
};

export default dial2d;
