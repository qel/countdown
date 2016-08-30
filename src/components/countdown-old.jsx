import React, {Component, PropTypes} from 'react';
import Moment from 'moment-timezone';


export class Countdown extends Component {
    static propTypes = {
        interval: PropTypes.number.isRequired,
        places: PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            ticks: 0,
            days: 0,
            hr: 0,
            min: 0,
            sec: 0,
            ms: 0,
            past: false,
            prev: {days: -1, hr: -1, min: -1, sec: -1, ms: -1}
        };
    }

    componentDidMount() {
        this.timer = setInterval(() => this.tick(), this.props.interval / 2);
        this.updateCanvas();
    }

    componentWillUpdate() {
        this.updateCanvas();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        // Instead of constantly setting the time and using shouldComponentUpdate(),
        // we can just skip updating the time if it's not time to re-render.
        //
        const time = Math.floor((new Date()).getTime() / this.props.interval);
        if (time === this.state.time) {
            return;
        }
        let ticksLeft = target.valueOf() / this.props.interval - time;
        const past = ticksLeft < 0;
        if (past) {
            ticksLeft = ticksLeft * -1;
        }
        const ticksPerSec = 1000 / this.props.interval;
        const ms = (ticksLeft % ticksPerSec) * this.props.interval;

        let t = Math.floor(ticksLeft / ticksPerSec); // total sec
        const sec = t % 60;
        t = Math.floor(t / 60); // total min
        const min = t % 60;
        t = Math.floor(t / 60); // total hr
        const hr = t % 24;
        t = Math.floor(t / 24); // total days
        const days = t;
        this.setState({
            time, days, hr, min, sec, ms, past, prev: this.state
        });
    }

    updateCanvas() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        const startRad = 1.5 * Math.PI;
        const endRad = 3.5 * Math.PI;
        const x = 240;
        const y = 240;

        const drawDial = (r, pos, oldPos, divisor) => {
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
        };
        drawDial(195, this.state.hr, this.state.prev.hr, 24);
        drawDial(160, this.state.min, this.state.prev.min, 60);
        drawDial(125, this.state.sec, this.state.prev.sec, 60);
        drawDial(90, this.state.ms, this.state.prev.ms, 1000);
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: '#ddd',
                    position: 'relative'
                }}
            >
                <canvas
                    ref="canvas"
                    width={480}
                    height={480}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 100
                    }}
                />
                <div
                    style={{
                        width: 480,
                        height: 160,
                        top: 220,
                        zIndex: 200,
                        textAlign: 'center',
                        fontFamily: 'Oldenburg',
                        position: 'absolute',
                        color: '#fff',
                        mixBlendMode: 'difference'
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'Faster One',
                            fontSize: '1.4em'
                        }}
                    >
                        {this.state.days + ' days ' + this.state.hr + ' hr. ' + this.state.min + ' min. '
                            + (this.state.sec + this.state.ms / 1000).toFixed(this.props.places) + ' sec.'}
                    </div>
                    {this.state.past ? 'after' : 'until'}
                    <br />
                    {targetDateStr}
                    <br />
                    {targetTimeStr}
                    &nbsp;
                    {targetTZName}
                    <br />
                    {offsetMessage}
                </div>
            </div>
        );
    }
}

export default Countdown;
