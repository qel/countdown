import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {polyfill} from 'raf';

import {setCanvas, setCanvasSize, tick} from '../redux/actions';

class AnimationRunner extends Component {
    constructor(props) {
        super(props);
        this.resizeCanvas = ::this.resizeCanvas;
        this.animationLoop = ::this.animationLoop;
    }

    componentDidMount() {
        if (!window.requestAnimationFrame) {
            polyfill();
        }
        window.addEventListener('resize', this.resizeCanvas, false);
        this.resizeCanvas();
        this.animationLoop();
    }

    resizeCanvas() {
        this.props.dispatch(setCanvasSize(window.innerWidth, window.innerHeight));
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
                    width={this.props.canvasWidth}
                    height={this.props.canvasHeight}
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
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    animationRunning: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    animationRunning: state.animationRunning
});

export default connect(mapStateToProps, null)(AnimationRunner);
