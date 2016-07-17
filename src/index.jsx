import React, {Component, PropertyTypes} from 'react';
import ReactDOM from 'react-dom';

console.log('hello!');

// actions

const setTargetTime = () => {

}

const setTargetTimeZone = () => {

}


// main

let queryString = window.location.search.substr(1)

const tzList = [
    { timeZone: 'America/New_York', name: 'Eastern' },
    { timeZone: 'America/Chicago', name: 'Central' },
    { timeZone: 'America/Denver', name: 'Mountain' },
    { timeZone: 'America/Los_Angeles', name: 'Pacific' },
    { timeZone: 'America/Phoenix', name: 'Arizona' },
    { timeZone: 'Pacific/Honolulu', name: 'Hawaii' },
    { timeZone: 'America/Anchorage', name: 'Alaska' },
    { timeZone: 'Asia/Kathmandu', name: 'Nepal (GMT+5:45)' },
    { timeZone: 'Asia/Kolkata', name: 'New Delhi (GMT+5:30)' }
];

if (queryString == '') {
    queryString = 'm=9&d=20&h=6&tz="America/New_York"';
}

// parse the query string
//
const queryObj = JSON.parse('{' + queryString.split('&')
    .map(x => {
        const kvp = x.split('=');
        return '"' + kvp[0] + '":' + kvp[1];
    })
  .join(',') + '}');

const now = new Date;

// build target Date object
//
let target = (() => {
    const m = queryObj.m || now.getMonth();
    const d = queryObj.d || now.getDate();
    const y = queryObj.y || now.getFullYear();
    const h = queryObj.h || 0;
    const min = queryObj.min || 0;
    const sec = queryObj.sec || 0;

    return new Date(m + '/' + d + '/' + y + '/' + ' ' + h + ':' + min + ':' + sec);
})()

// get the local timezone
//
let localTZ;

if (typeof Intl !== 'undefined') {
    localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
} else {
    for (x of tzList) {
        if (now.toLocaleString('en-us', { hour: 'numeric', hour12: false })
            == now.toLocaleString('en-us', { timeZone: x.timeZone, hour: 'numeric', hour12: false }))
        {
            localTZ = x.timeZone;
            break;
        }
    }
}

const targetTZ = queryObj.tz || localTZ;

// timeZoneName can be "short", "long"
const targetTZName = target.toLocaleTimeString('en-us', { timeZone: targetTZ, timeZoneName: 'long' }).split('M ')[1];
const localTZName = target.toLocaleTimeString('en-us', { timeZone: localTZ, timeZoneName: 'long' }).split('M ')[1];

console.log('local timezone = ' + localTZ + ' = ' + localTZName);

let offsetMessage = null;

// see if we're targeting midnight before we localize the target time
//
const midnight = target.getHours() == 0;

// translate to a different timezone
if (queryObj.tz) {
    const targetHour = target.toLocaleString('en-us', { hour: 'numeric', hour12: false });
    const targetMin = target.toLocaleString('en-us', { minute: 'numeric' });
    const targetDay = target.toLocaleString('en-us', { day: 'numeric' });
    const targetHourWithTZ = target.toLocaleString('en-us',
        { timeZone: targetTZ, hour: 'numeric', hour12: false });
    const targetMinWithTZ = target.toLocaleString('en-us',
        { timeZone: targetTZ, minute: 'numeric' });
    const targetDayWithTZ = target.toLocaleString('en-us',
        { timeZone: targetTZ, day: 'numeric' });
    let targetOffset = targetHour - targetHourWithTZ;

    // if minutes are different, adjust for partial hours
    if (targetMin !== targetMinWithTZ) {
        targetOffset += (targetMin - targetMinWithTZ) / 60;
    }

    if (targetOffset !== 0 || targetDay != targetDayWithTZ) {
    if (targetDay != targetDayWithTZ) {
        console.log('targetOffset: ' + targetOffset);
        console.log('targetDay: ' + targetDay);
        console.log('targetDayWithTZ: ' + targetDayWithTZ);
        if ((targetDay > targetDayWithTZ && targetDayWithTZ != 1)
            || (targetDay == 1 && targetDayWithTZ > 15))
        {
            targetOffset += 24;
        } else {
            targetOffset -= 24;
        }
        console.log('New targetOffset: ' + targetOffset);
    }

    if (targetOffset < 0) {
        offsetMessage = targetOffset * -1 + ' hour' + (targetOffset == -1 ? '' : 's')
            + ' ahead of local time (' + localTZName + ').';
        } else if (targetOffset > 0) {
            offsetMessage = targetOffset + ' hour' + (targetOffset == 1 ? '' : 's')
            + ' behind local time (' + localTZName + ').';
        }

        target.setTime(target.getTime() + (targetOffset*60*60*1000));
    }
}

// weekday can be "narrow", "short", "long"
const weekdayName = target.toLocaleString('en-us', { timeZone: targetTZ, weekday: 'long' });

// month can be "numeric", "2-digit", "narrow", "short", "long"
const monthName = target.toLocaleString('en-us', { timeZone: targetTZ, month: 'long' });

const targetDateStr = weekdayName + ", " + monthName + " " + target.getDate() + ", " + target.getFullYear();

const targetTimeStr = midnight ? "midnight" : target.toLocaleTimeString('en-us', { timeZone: targetTZ }).toLowerCase();

class Counter extends React.Component {
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
            prev: { days: -1, hr: -1, min: -1, sec: -1, ms: -1 }
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
        if (time == this.state.time) {
            return;
        }
        let ticksLeft = target.getTime() / this.props.interval - time;
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
            time: time, days: days, hr: hr, min: min, sec: sec, ms: ms, past: past, prev: this.state
        });
    }

    updateCanvas() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        const startRad = 1.5*Math.PI;
        const endRad = 3.5*Math.PI;
        const x = 240;
        const y = 240;

        const drawDial = (r, pos, oldPos, divisor) => {
            if (pos == oldPos) {
                return;
            }
            const rad = (1.5+pos/divisor*2)*Math.PI;
            if (oldPos < pos) {
                ctx.beginPath();
                ctx.arc(x, y, r, startRad, endRad);
                ctx.lineWidth=30;
                ctx.strokeStyle = '#333';
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(x, y, r, rad, endRad);
            ctx.lineWidth=35;
            ctx.strokeStyle = '#ddd';
            ctx.stroke();
        }
        drawDial(195, this.state.hr, this.state.prev.hr, 24);
        drawDial(160, this.state.min, this.state.prev.min, 60);
        drawDial(125, this.state.sec, this.state.prev.sec, 60);
        drawDial(90, this.state.ms, this.state.prev.ms, 1000);
    }

    render() {
        return (
            <div style={
                {
                    backgroundColor: '#ddd',
                    position: 'relative'
                }
            }>
                <canvas ref="canvas" width={480} height={480} style={
                    {
                        backgroundColor: '#ddd',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }
                } />
                <div style={
                    {
                        width: 480,
                        height: 160,
                        top: 220,
                        textAlign: 'center',
                        fontFamily: 'Oldenburg',
                        position: 'absolute',
                        color: '#fff',
                        mixBlendMode: 'difference'
                    }
                }>
                <div style={{
                    fontFamily: 'Faster One',
                    fontSize: '1.4em'
                }}>
                    { this.state.days + " days " + this.state.hr + " hr. " + this.state.min + " min. " + (this.state.sec + this.state.ms / 1000).toFixed(this.props.places) + " sec."  }
                </div>
                { this.state.past ? "after" : "until" }
                <br />
                { targetDateStr }
                <br />
                { targetTimeStr }
                &nbsp;
                { targetTZName }
                <br />
                { offsetMessage }
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Counter interval={40} places={2} />,
    document.getElementById('app')
);
