import React, {Component, PropTypes} from 'react';
import Moment from 'moment-timezone';
import {betterGuess, packMoment, unpackMoment, zoneList} from '../util/moment-pack';

// --------------------------------------------------------------------------------
// get the target time
//
let queryString = window.location.search.substr(1);

if (queryString === '') {
    queryString = 'm=9&d=20&h=6&tz="America/New_York"';
}

// parse the query string
//
const queryPairs = queryString.split('&');
const now = new Moment();

let target;

if (queryPairs.length === 1 && queryPairs[0].indexOf('=') === -1) {
    // get a packed moment from packed queryString
    //
    target = unpackMoment(queryString);

    console.log('unpacked querystring!');
    console.dir(target);
} else {
    // get a moment from a normal queryString
    //
    const queryObj = JSON.parse('{' + queryString.split('&')
        .map(x => {
            const kvp = x.split('=');
            return '"' + kvp[0] + '":' + kvp[1];
        })
        .join(',') + '}');

    // build target Date object
    //
    const momentProps = {
        year: queryObj.y || now.year(),
        month: queryObj.m - 1 || now.month() - 1,
        date: queryObj.d || now.date(),
        hour: queryObj.h || 0,
        minute: queryObj.min || 0,
        second: queryObj.sec || 0
    };

    // return new Date(m + '/' + d + '/' + y + ' ' + h + ':' + min + ':' + sec);
    // return new tc.DateTime(y, m, d, h, min, sec);
    if (queryObj.tz) {
        target = Moment.tz(momentProps, queryObj.tz);
    } else {
        target = new Moment(momentProps);
    }
}

console.log('target time packs to');
console.log('1 prop (hr):', packMoment(target, 1));
console.log('3 props (hr/mo/day):', packMoment(target, 3));
console.log('4 props (hr/mo/day/timeZone):', packMoment(target, 4));
console.log('5 props (hr/mo/day/year/timeZone):', packMoment(target, 5));
console.log('6 props (hr/mo/day/year/min/timeZone):', packMoment(target, 6));
console.log('7 props (hr/mo/day/year/min/sec/timeZone):', packMoment(target, 7));
console.log('8 props (hr/mo/day/year/min/sec/timeZone(cont:1,city:1):', packMoment(target, 8));
console.log('9 props (hr/mo/day/year/min/sec/timeZone(cont:1,city:2):', packMoment(target, 9));
console.log('10 props (hr/mo/day/year/min/sec/timeZone(cont:1,city:3):', packMoment(target, 10));
console.log('11 props (hr/mo/day/year/min/sec/timeZone(cont:2,city:3):', packMoment(target, 11));

// --------------------------------------------------------------------------------
// actual visual stuff now
//
const localTZ = betterGuess();
const targetTZ = target.tz();

console.log('local timeZone:', localTZ);
console.log('target timeZone:', targetTZ);

// timeZoneName can be "short", "long"
const targetTZName = target.format('z');
const localTZName = now.format('z');

let offsetMessage = null;

// see if we're targeting midnight before we localize the target time
//
const midnight = target.hour() === 0;

const weekdayName = target.format('dddd');

const monthName = target.format('MMMM');

const dayofMonth = target.format('Do');

const targetDateStr = weekdayName + ', ' + monthName + ' ' + dayofMonth + ', ' + target.year();

const targetTimeStr = midnight ? 'midnight' : target.format('h:mm:ss a');

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
                ctx.strokeStyle = '#333';
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(x, y, r, rad, endRad);
            ctx.lineWidth = 35;
            ctx.strokeStyle = '#ddd';
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
                        backgroundColor: '#ddd',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                />
                <div
                    style={{
                        width: 480,
                        height: 160,
                        top: 220,
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
