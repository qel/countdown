import React, {Component} from 'react';

import {connect} from 'react-redux';

import {Countdown} from './countdown';
import {tick, animationStarted} from '../redux/actions';

class Container extends Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    startAnimation() {
        const {store} = this.context;

        const animation = () => {
            if (store.getState().animateStarted) {
                store.dispatch(tick());
                window.requestAnimationFrame(animation);
            }
        };

        store.dispatch(animationRunning());
    }

    render() {
        return (
            <Countdown
                {...state}
                startAnimation={::this.startAnimation}
            />
        );
    }
}

Container.contextTypes = {
    store: React.PropTypes.object
};

export default Container;
