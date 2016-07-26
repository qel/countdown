import React, {Component, PropertyTypes} from 'react';

class ConsoleOverride {
    constructor(stack) {
        this.stack = stack;
        this.callback = null;

        this.setCallback = this.setCallback.bind(this);

        window.console._error = window.console.error;
        window.console.error = (...args) => {
            this.stack.push(['error: ', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console._error(args);
        }
        window.console._info = window.console.info;
        window.console.info = (...args) => {
            this.stack.push(['info: ', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console._info(args);
        }
        window.console._log = window.console.log;
        window.console.log = (...args) => {
            this.stack.push(['', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console._log(args);
        }
        window.console._warn = window.console.warn;
        window.console.warn = (...args) => {
            this.stack.push(['warn: ', ...args]);
            if (this.callback) {
            }
            window.console._warn(args);
        }
    }

    setCallback(callback) {
        this.callback = callback;
        this.callback(this.stack);
    }
}

window.console.stack = [];
window.consoleOverride = new ConsoleOverride(window.console.stack);

window.addEventListener('DOMContentLoaded', () => {
    console.log('window DOMContentLoaded (capture) fired!');
}, true)

export class ConsoleEcho extends Component {
    constructor(props) {
        super(props);
        this.state = {
            log: []
        };
    }

    componentDidMount() {
        window.consoleOverride.setCallback((stack) => {
            this.setState({
                log: stack
            })
        })
    }

    render() {
        const expandList = this.state.log.map((log, key) => {
            var msg;
            var prefix;
            var args = [];
            [prefix, ...args] = log;
            args.forEach((arg) => {
                if (typeof arg == 'object') {
                    msg = prefix + (JSON && JSON.stringify ? JSON.stringify(arg) : arg) + ' ';
                } else {
                    msg = prefix + arg;
                }
            })
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
