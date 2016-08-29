import React, {Component} from 'react';
import {connect} from 'react-redux';

import {tick} from '../redux/actions';

class AnimationRunner extends Component {
    constructor(props) {
        this.animationLoop = ::this.animationLoop;
    }

    componentDidMount() {
        this.animationLoop();
    }

    animationLoop() {
        if (this.props.animationRunning) {
            store.dispatch(tick());
        }
        window.requestAnimationFrame(this.animationLoop);
    }

    render() {
        return (
            <div>
                {props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    animationRunning: state.animationRunning
});

AnimationRunner = connect(mapStateToProps, null)(AnimationRunner);

export default AnimationRunner;
