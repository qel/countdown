import React, {PropTypes} from 'react';

export const NickCage = ({disabled}) => {
    if (disabled) {
        return null;
    }
    return (
        <div>
            <img
                src="http://media.giphy.com/media/13KQ6e5IEwAKJ2/giphy.gif"
                alt="left Cage"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '480px',
                    zIndex: 0
                }}
            >
            </img>
            <img
                src="http://media.giphy.com/media/FDUxpEiVkowaQ/giphy.gif"
                alt="right Cage"
                style={{
                    position: 'absolute',
                    top: `${window.innerHeight - 204}px`,
                    left: `${window.innerWidth - 480}px`,
                    width: '480px',
                    zIndex: 0
                }}
            >
            </img>
        </div>
    );
};

NickCage.propTypes = {
    disabled: PropTypes.bool.isRequired
};

export default NickCage;
