import React, {useState} from 'react';
import Loadingsvg from './svg/Loadingsvg';
import Header from './Header';
import cx from 'clsx';

function LoadingSplash(props) {
    return (
        <div className="loading-page dark">
            <Loadingsvg show={true}/>
        </div>
    );
}

export default LoadingSplash;
