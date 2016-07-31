import Moment from 'moment-timezone';
import base62 from 'base62';

// TODO: add logic that makes this dig through the moment.tz.names()
// list if we don't find something here in our short timeZone list

export const zoneList = [
    {timeZone: 'America/New_York', name: 'Eastern'},
    {timeZone: 'America/Chicago', name: 'Central'},
    {timeZone: 'America/Denver', name: 'Mountain'},
    {timeZone: 'America/Los_Angeles', name: 'Pacific'},
    {timeZone: 'America/Phoenix', name: 'Arizona'},
    {timeZone: 'Pacific/Honolulu', name: 'Hawaii'},
    {timeZone: 'America/Anchorage', name: 'Alaska'},
    {timeZone: 'Europe/London', name: 'London (GMT)'},
    {timeZone: 'Asia/Tokyo', name: 'Japan'},
    {timeZone: 'Australia/Sydney', name: 'Sydney'},
    {timeZone: 'Asia/Kathmandu', name: 'Nepal (GMT+5:45)'},
    {timeZone: 'Asia/Kolkata', name: 'New Delhi (GMT+5:30)'}
];

const encodeMap = [
    {prop: 'hour', offset: 0, base: 24},
    {prop: 'month', offset: 0, base: 13, nullable: true},
    {prop: 'date', offset: 1, base: 31},
    {prop: 'tzCity', char: 0, offset: 97, base: 28, nullable: true},
    {prop: 'year', offset: 1900, base: 201, nullable: true},
    {prop: 'minute', offset: 0, base: 61, nullable: true},
    {prop: 'second', offset: 0, base: 61, nullable: true},
    {prop: 'tzCont', char: 0, offset: 97, base: 28, nullable: true},
    {prop: 'tzCity', char: 1, offset: 97, base: 28, nullable: true},
    {prop: 'tzCity', char: 2, offset: 97, base: 28, nullable: true},
    {prop: 'tzCont', char: 1, offset: 97, base: 28, nullable: true}
];

// utility function to get the local timeZone of the browser
// (used when unpacking a moment with no timeZone data)
export const betterGuess = () => {
    // check Intl for the real timeZone
    if (window && window.Intl && window.Intl.DateTimeFormat() && window.Intl.DateTimeFormat().resolvedOptions()
        && window.Intl.DateTimeFormat().resolvedOptions().timeZone) {
        return (Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    // iterate zoneList and see if something matches our current offset
    const now = new Moment();
    for (let x = 0; x < zoneList.length; x++) {
        if (now.format('H') === now.clone().tz(zoneList[x].timeZone).format('H')) {
            return x.timeZone;
        }
    }

    // default back to tz.guess()
    return Moment.tz.guess();
};

// convert timeZone to lowercase and make all non-alpha characters Char 123
export const base27str = (s) => {
    const strArr = s.toLowerCase().split('');
    for (let i = 0; i < strArr.length; i++) {
        const code = strArr[i].charCodeAt(0);
        if (code < 96 || code > 123) {
            strArr[i] = String.fromCharCode(123);
        }
    }
    return strArr.join('');
};

export const packMoment = (target, propCount) => {
    if (propCount < encodeMap.length && encodeMap[propCount].nullable !== true) {
        throw new Error('Cannot encode this propCount because the next prop is not nullable.');
    }

    const moment = new Moment(target);

    // split the timeZone into Continent and City
    const zoneArr = target.tz().split('/');

    moment.tzCont = base27str(zoneArr[0]);
    moment.tzCity = base27str(zoneArr[1]);

    let packed = 0;

    for (let p = propCount - 1; p >= 0; p--) {
        const map = encodeMap[p];
        let val;

        if (map.char !== undefined) {
            val = moment[map.prop][map.char].charCodeAt(0);
        } else {
            val = moment[map.prop]();
        }

        if (map.offset) {
            val -= map.offset;
        }

        if (map.nullable) {
            val++;
        }

        // multiply the packed number by the base then add the value
        packed = packed * map.base + val;
    }
    return base62.encode(packed);
};

export const unpackMoment = (s) => {
    let packed = base62.decode(s);
    const momentProps = {};

    for (let p = 0; p < encodeMap.length; p++) {
        const map = encodeMap[p];
        let val = packed % map.base;

        if (map.nullable) {
            if (val === 0) {
                break; // bail out when we hit a null nullable
            }
            val--; // null is zero, so we have to subtract 1 to get the real value
        }

        if (map.offset) {
            val += map.offset;
        }

        if (map.char !== undefined) {
            const c = String.fromCharCode(val);

            if (momentProps[map.prop]) {
                momentProps[map.prop] += c;
            } else {
                momentProps[map.prop] = c;
            }
        } else {
            momentProps[map.prop] = val;
        }

        packed = Math.floor(packed / map.base);
    }

    if (momentProps.tzCity) {
        // iterate through the zoneList looking for the first match
        for (let z = 0; z < zoneList.length; z++) {
            const tz = zoneList[z].timeZone;
            const zoneArr = tz.split('/');

            if (momentProps.tzCont) {
                if (base27str(zoneArr[0]).startsWith(momentProps.tzCont)
                    && base27str(zoneArr[1]).startsWith(momentProps.tzCity)) {
                    return Moment.tz(momentProps, tz);
                }
            } else {
                if (base27str(tz.split('/')[1]).startsWith(momentProps.tzCity)) {
                    return Moment.tz(momentProps, tz);
                }
            }
        }
    }

    if (momentProps.minute === undefined) {
        momentProps.minute = 0;
    }

    return Moment.tz(momentProps, betterGuess());
};
