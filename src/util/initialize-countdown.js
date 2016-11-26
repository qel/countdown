import Moment from 'moment-timezone';
import {betterGuess, unpackMoment} from './moment-pack';

const initializeCountdown = () => {
    // --------------------------------------------------------------------------------
    // get the target time
    //
    let queryString = window.location.search.substr(1);

    if (queryString === '') {
        queryString = 'm=12&d=15&h=14&tz=America/Chicago';
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
    } else {
        // get a moment from a normal queryString
        //
        const queryObj = JSON.parse('{' + queryString.split('&')
            .map(x => {
                const kvp = x.split('=');
                return '"' + kvp[0] + '":' + (isNaN(kvp[1]) ? '"' + kvp[1] + '"' : kvp[1]);
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

    // --------------------------------------------------------------------------------
    // actual visual stuff now
    //
    const localTimezone = betterGuess();
    const targetTimezone = target.tz();

    // timeZoneName can be "short", "long"
    const targetTZName = target.format('z');
    // const localTZName = now.format('z');

    const offsetMessage = 'GMT ' + target.format('Z');

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
        targetTime: target.format('X') * 1000,
        targetTimezone,
        targetDateStr,
        targetTimeStr,
        targetTZName,
        offsetMessage
    };
};

export default initializeCountdown;
