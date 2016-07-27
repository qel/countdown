import React, {Component} from 'react';

class ConsoleOverride {
    constructor(stack) {
        this.stack = stack;
        this.callback = null;

        this.setCallback = this.setCallback.bind(this);

        window.console.oldError = window.console.error;
        window.console.error = (...args) => {
            this.stack.push(['error: ', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console.oldError(args);
        };
        window.console.oldInfo = window.console.info;
        window.console.info = (...args) => {
            this.stack.push(['info: ', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console.oldInfo(args);
        };
        window.console.oldLog = window.console.log;
        window.console.log = (...args) => {
            this.stack.push(['', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console.oldLog(args);
        };
        window.console.oldWarn = window.console.warn;
        window.console.warn = (...args) => {
            this.stack.push(['warn: ', ...args]);
            if (this.callback) {
                this.callback(this.stack);
            }
            window.console.oldWarn(args);
        };
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
}, true);

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
            });
        });
    }

    render() {
        const expandList = this.state.log.map((log, key) => {
            let msg;
            const [prefix, ...args] = log;
            args.forEach((arg) => {
                if (typeof arg === 'object') {
                    msg = prefix + JSON.stringify(arg);
                } else {
                    msg = prefix + arg;
                }
            });
            return (
                <li key={key}>{msg}</li>
            );
        });
        return (
            <div
                style={{
                    position: 'absolute',
                    top: '500px'
                }}
            >
                <h1>Log</h1>
                {expandList}
            </div>
        );
    }
}

export default ConsoleEcho;
