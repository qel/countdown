import React, {Component, PropTypes} from 'react';
import Moment from 'moment-timezone';
import base62 from 'base62';

// main

let queryString = window.location.search.substr(1);

const tzList = [
    {timeZone: 'America/New_York', name: 'Eastern'},
    {timeZone: 'America/Chicago', name: 'Central'},
    {timeZone: 'America/Denver', name: 'Mountain'},
    {timeZone: 'America/Los_Angeles', name: 'Pacific'},
    {timeZone: 'America/Phoenix', name: 'Arizona'},
    {timeZone: 'Pacific/Honolulu', name: 'Hawaii'},
    {timeZone: 'America/Anchorage', name: 'Alaska'},
    {timeZone: 'Asia/Kathmandu', name: 'Nepal (GMT+5:45)'},
    {timeZone: 'Asia/Kolkata', name: 'New Delhi (GMT+5:30)'}
];

if (queryString === '') {
    queryString = 'm=9&d=20&h=6&tz="America/New_York"';
}

const encodeMap = [
    {prop: 'hour', offset: 0, range: 24},
    {prop: 'month', offset: 0, range: 12},
    {prop: 'date', offset: 1, range: 31},
    {prop: 'zone', char: 0, offset: 97, range: 27, nullable: true},
    {prop: 'year', offset: 1900, range: 201, nullable: true},
    {prop: 'minute', offset: 0, range: 61, nullable: true},
    {prop: 'second', offset: 0, range: 61, nullable: true},
    {prop: 'zone', char: 1, offset: 97, range: 27, nullable: true},
    {prop: 'zone', char: 2, offset: 97, range: 27, nullable: true}
];

const targetEncode = (target, propCount) => {
    if (! encodeMap[propCount].nullable) {
        throw new Error('Cannot encode this propCount because the next prop is not nullable.');
    }
    const moment = new Moment(target);
    let out = 0;
    const zoneArr = target.zone.split('/')[1].toLowerCase().split('');
    for (let i = 0; i < zoneArr.length; i++) {
        const code = zoneArr[i].charCodeAt(0);
        if (code < 96 || code > 123) {
            zoneArr[i] = String.fromCharCode(123);
        }
    }
    moment.zone = zoneArr.join('');
    console.log('ceiling at }', moment.zone);
    for (let p = propCount - 1; p >= 0; p--) {
        const map = encodeMap[p];
        let val;
        const charIndex = encodeMap[p].char;
        const offset = encodeMap[p].offset;
        if (charIndex !== undefined) {
            val = moment[encodeMap[p].prop][charIndex].charCodeAt(0);
        } else {
            val = moment[encodeMap[p].prop]();
        }
        if (encodeMap[p].nullable) {
            val -= 1;
        }
        if (offset) {
            val -= offset;
        }
        for (let exp = (p - 1); exp >= 0; exp--) {
            val *= encodeMap[p - 1].range;
        }
        out += val;
    }
    console.log('targetEncode demimal output', out);
    return base62.encode(out);
};

const targetDecode = (s) => {
    let packed = base62.decode(s);
    const moment = new Moment();
    for (let p = 0; p < encodeMap.length; p++) {
        const map = encodeMap[p];
        let val = packed % map.range;
        if (map.nullable) {
            if (val === 0) {
                return moment; // bail out when we hit a null nullable
            }
            val--; // null is zero, so we have to subtract 1 to get the real value
        }
        if (map.offset) {
            val += map.offset;
        }
        console.log('decoding prop', map.prop);
        console.log('val', val);
        if (map.char !== undefined) {
            const c = String.fromCharCode(val);
            if (moment[map.prop]) {
                moment[map.prop] += c;
            } else {
                moment[map.prop] = c;
            }
        } else {
            moment[map.prop](val);
        }
        packed /= map.range;
    }
    return moment;
};

// parse the query string
//
const queryObj = JSON.parse('{' + queryString.split('&')
    .map(x => {
        const kvp = x.split('=');
        return '"' + kvp[0] + '":' + kvp[1];
    })
    .join(',') + '}');

console.log('queryObj.tz', queryObj.tz);

const now = new Moment();

// build target Date object
//
const target = (() => {
    const y = queryObj.y || now.year();
    const m = queryObj.m || now.month();
    const d = queryObj.d || now.getDate();
    const h = queryObj.h || 0;
    const min = queryObj.min || 0;
    const sec = queryObj.sec || 0;

    // return new Date(m + '/' + d + '/' + y + ' ' + h + ':' + min + ':' + sec);
    // return new tc.DateTime(y, m, d, h, min, sec);
    const ret = new Moment({
        year: y,
        month: m - 1, // *** WHY????? ***
        date: d,
        hour: h,
        minute: min,
        second: sec
    });
    ret.zone = queryObj.tz;
    return ret;
})();

console.log('target month:', target.month());

let enc = targetEncode(target, 4);
console.log('target encoded:', enc);

console.log('decoding', enc);
console.dir(targetDecode(enc));


// get the local timezone
//
let localTZ;

if (window && window.Intl && window.Intl.DateTimeFormat() && window.Intl.DateTimeFormat().resolvedOptions()
    && window.Intl.DateTimeFormat().resolvedOptions().timeZone) {
    console.log('local timezone data!');
    localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
} else {
    tzList.forEach((x) => {
        console.log('now ' + now.format('H') + ' == ' + now.clone().tz(x.timeZone).format('H') + ' ' + x.timeZone);
        if (now.format('H') === now.clone().tz(x.timeZone).format('H')) {
            localTZ = x.timeZone;
            console.log('x', x);
            console.log('localTZ', localTZ);
            return;
        }
    });
}

console.log('target month2:', target.month());

const targetTZ = queryObj.tz || localTZ;

// timeZoneName can be "short", "long"
const targetTZName = target.tz(targetTZ).format('z');
const localTZName = target.tz(localTZ).format('z');

console.log('target');
console.dir(target);
console.log('localTZ', localTZ);
console.log('targetTZ', targetTZ);
console.log('target timezone = ' + targetTZName);
console.log('local timezone = ' + localTZ + ' = ' + localTZName);

let offsetMessage = null;

console.log('target month3:', target.month());

// see if we're targeting midnight before we localize the target time
//
const midnight = target.hour() === 0;

const weekdayName = target.format('dddd');

const monthName = target.format('MMMM');

const dayofMonth = target.format('Do');

const targetDateStr = weekdayName + ', ' + monthName + ' ' + dayofMonth + ', ' + target.year();

const targetTimeStr = midnight ? 'midnight' : target.format('h:mm:ss a');

console.log('target month4:', target.format('MMMM'));

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
