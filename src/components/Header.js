import React from 'react';

import './../styles/header.scss';

import iconInfo from './../images/info-light.svg';

const Header = () => {
    return (
        <header className="header">
            <h2 className="header--text">Driver Feedback</h2>
            <img 
                src={iconInfo}
                className="header--icon"
                alt="more info"
            ></img>
        </header>
    )
};

export default Header;