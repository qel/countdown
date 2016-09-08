import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {polyfill} from 'raf';
import ObjectAssign from 'es6-object-assign';

import {setCanvasContext, setCanvasContext3d, setCanvasSize, tick} from '../redux/actions';

class AnimationRunner extends Component {
    constructor(props) {
        super(props);
        this.getCanvasContext = ::this.getCanvasContext;
        this.getCanvasContext3d = ::this.getCanvasContext3d;
        this.resizeCanvas = ::this.resizeCanvas;
        this.animationLoop = ::this.animationLoop;

        if (!window.requestAnimationFrame) {
            console.log('polyfilling requestAnimationFrame...');
            polyfill();
        }
        if (!window.Object.assign) {
            console.log('polyfilling Object.assign...');
            ObjectAssign.polyfill();
        }

        document.body.style.overflow = 'hidden';
        window.addEventListener('resize', this.resizeCanvas, false);
    }

    componentDidMount() {
        this.resizeCanvas();
        this.animationLoop();
    }

    getCanvasContext(canvas) {
        if (canvas && !this.props.canvasContext) {
            this.props.dispatch(setCanvasContext(canvas.getContext('2d')));
        }
    }

    getCanvasContext3d(canvas) {
        if (this.props.webglEnabled) {
            if (this.props.canvasContext3d) {
                // if we're re-rendering and we already have our context,
                // this is probably a resize, so set the viewport dimensions
                const gl = this.props.canvasContext3d;

                gl.viewport(0, 0, this.props.canvasWidth, this.props.canvasHeight);
            } else {
                // if we don't have the context yet, set it (if canvas is available)
                if (canvas) {
                    const gl = canvas.getContext('webgl', {
                        preserveDrawingBuffer: true
                    });

                    this.props.dispatch(setCanvasContext3d(gl));
                    gl.viewport(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
                }
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
        console.log('AnimationRunner render');

        let webglCanvas = null;

        if (this.props.webglEnabled) {
            webglCanvas = (
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
            );
        }

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
                {webglCanvas}
                {this.props.children}
            </div>
        );
    }
}

AnimationRunner.propTypes = {
    webglEnabled: PropTypes.bool,
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    canvasContext: PropTypes.object,
    canvasContext3d: PropTypes.object,
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired,
    animationRunning: PropTypes.bool.isRequired
};

AnimationRunner.defaultProps = {
    webglEnabled: true
};

const mapStateToProps = (state) => ({
    canvasContext: state.canvasContext,
    canvasContext3d: state.canvasContext3d,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    animationRunning: state.animationRunning
});

export default connect(mapStateToProps, null)(AnimationRunner);
