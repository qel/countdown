import Moment from 'moment-timezone';
import {betterGuess, packMoment, unpackMoment} from './moment-pack';

const initializeCountdown = () => {
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
            target = Moment.tz(momentProps, betterGuess());
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
    const localTimezone = betterGuess();
    const targetTimezone = target.tz();

    console.log('local timeZone:', localTimezone);
    console.log('target timeZone:', targetTimezone);

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

    return {
        localTimezone,
        targetTime: target.format('X'),
        targetTimezone,
        targetDateStr,
        targetTimeStr,
        targetTZName,
        offsetMessage
    };
};

export default initializeCountdown;
