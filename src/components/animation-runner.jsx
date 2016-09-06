import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {polyfill} from 'raf';

import {setCanvasContext, setCanvasContext3d, setCanvasSize, tick} from '../redux/actions';

class AnimationRunner extends Component {
    constructor(props) {
        super(props);
        this.getCanvasContext = ::this.getCanvasContext;
        this.getCanvasContext3d = ::this.getCanvasContext3d;
        this.resizeCanvas = ::this.resizeCanvas;
        this.animationLoop = ::this.animationLoop;

        document.body.style.overflow = 'hidden';
        window.addEventListener('resize', this.resizeCanvas, false);
    }

    componentDidMount() {
        if (!window.requestAnimationFrame) {
            polyfill();
        }
        this.resizeCanvas();
        this.animationLoop();
    }

    getCanvasContext(canvas) {
        if (canvas && !this.props.canvasContext) {
            this.props.dispatch(setCanvasContext(canvas.getContext('2d')));
        }
    }

    getCanvasContext3d(canvas) {
        if (this.props.canvasContext3d) {
            // if we're re-rendering and we already have our context,
            // this is probably a resize, so set the viewport dimensions
            const gl = this.props.canvasContext3d;

            gl.viewport(0, 0, this.props.canvasWidth, this.props.canvasHeight);
        } else {
            // if we don't have the context yet, set it (if canvas is available)
            if (canvas) {
                const gl = canvas.getContext('webgl');

                this.props.dispatch(setCanvasContext3d(gl));
                gl.viewport(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
            }
        }
    }

    resizeCanvas() {
        this.props.dispatch(setCanvasSize(document.documentElement.clientWidth, document.documentElement.clientHeight));
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
                    ref={(c) => {this.getCanvasContext(c);}}
                    width={this.props.canvasWidth}
                    height={this.props.canvasHeight}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 200
                    }}
                />
                <canvas
                    ref={(c) => {this.getCanvasContext3d(c);}}
                    width={this.props.canvasWidth}
                    height={this.props.canvasHeight}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 400
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
    canvasContext: PropTypes.object,
    canvasContext3d: PropTypes.object,
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    animationRunning: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    animationRunning: state.animationRunning
});

export default connect(mapStateToProps, null)(AnimationRunner);
