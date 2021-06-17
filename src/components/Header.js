import React from 'react';

import ThemeToggle from './ThemeToggle';

import './../styles/header.scss';

import iconInfo from './../images/info-light.svg';

const Header = (props) => {

    const { toggleLightDark, isDarkMode } = props;

    return (
        <header className={`header ${isDarkMode ? 'dark' : ''}`}>
            <div className="header--theme-toggle">
                <ThemeToggle 
                    toggleLightDark={toggleLightDark}
                    isDarkMode={isDarkMode}
                />
            </div>
            <img 
                src={iconInfo}
                className="header--icon"
                alt="more info"
            ></img>
        </header>
    )
};

export default Header;