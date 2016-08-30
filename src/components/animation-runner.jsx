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
        const children = React.Children.map(props.children, (child) => React.cloneElement(child, {canvas: {}});
        return (
            <div>
                <canvas
                    ref={(c) => React.Children.forEach(children, (child) => {child.props.canvas = c})}
                    width={480}
                    height={480}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 100
                    }}
                />
                {children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    animationRunning: state.animationRunning
});

AnimationRunner = connect(mapStateToProps, null)(AnimationRunner);

export default AnimationRunner;
