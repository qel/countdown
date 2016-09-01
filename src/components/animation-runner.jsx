import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {setCanvas, tick} from '../redux/actions';

class AnimationRunner extends Component {
    constructor(props) {
        super(props);
        this.animationLoop = ::this.animationLoop;
    }

    componentDidMount() {
        this.animationLoop();
    }

    animationLoop() {
        if (this.props.animationRunning) {
            this.props.dispatch(tick());
        }
        window.requestAnimationFrame(this.animationLoop);
    }

    render() {
        return (
            <div>
                <canvas
                    ref={(c) => {this.props.dispatch(setCanvas(c));}}
                    width={480}
                    height={480}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 100
                    }}
                />
                {this.props.children}
            </div>
        );
    }
}

AnimationRunner.propTypes = {
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    animationRunning: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    animationRunning: state.animationRunning
});

export default connect(mapStateToProps, null)(AnimationRunner);
