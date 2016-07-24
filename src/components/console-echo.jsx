import React, {Component, PropertyTypes} from 'react';

export class ConsoleEcho extends Component {
    constructor(props) {
        super(props);
        this.state = {
            log: []
        };

        this.log = this.log.bind(this);

        window.console._error = window.console.error;
        window.console.error = (...args) => {
            this.log('error: ', args);
            window.console._error(args);
        }
        window.console._info = window.console.info;
        window.console.info = (...args) => {
            this.log('info: ', args);
            window.console._info(args);
        }
        window.console._log = window.console.log;
        window.console.log = (...args) => {
            this.log('', args);
            window.console._log(args);
        }
        window.console._warn = window.console.warn;
        window.console.warn = (...args) => {
            this.log('warn: ', args);
            window.console._warn(args);
        }
    }

    log(prefix, args) {
        for (const arg of args) {
            var nextLog = this.state.log;

            if (typeof arg == 'object') {
                nextLog.push(prefix + (JSON && JSON.stringify ? JSON.stringify(arg) : arg) + ' ');
            } else {
                nextLog.push(prefix + arg);
            }

            this.setState({
                log: nextLog
            });
        }
    }

    render() {
        const expandList = this.state.log.map((msg, key) => {
            return (
                <li key={key}>{msg}</li>
            );
        })
        return (
            <div style={{
                position: 'absolute',
                top: '500px'
            }}>
                <h1>Log</h1>
                {expandList}
            </div>
        )
    }
}

export default ConsoleEcho;
