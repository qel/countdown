import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import reducer from './redux/reducer';
import initializeCountdown from './util/initializeCountdown';
import AnimationRunner from './components/animation-runner';
import CountdownContainer from './components/countdown-container';
import NickCage from './components/nick-cage';

const store = createStore(reducer);

store.dispatch(init(initializeCountdown()));

ReactDOM.render(
    <Provider store={store}>
        <AnimationRunner>
            <CountdownContainer places={2} />
            <NickCage disabled />
        </AnimationRunner>
    </Provider>
    , document.getElementById('app')
);
