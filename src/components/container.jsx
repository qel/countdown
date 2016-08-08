import {connect} from 'react-redux';
import React, {Component} from 'react';

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

        const recurseAnimation = () => {
            if (store.getState().animateStarted) {
                store.dispatch(tick());
                window.requestAnimationFrame(recurseAnimation);
            }
        };

        store.dispatch(animationStarted());
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
