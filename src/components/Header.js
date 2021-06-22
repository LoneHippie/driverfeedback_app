import React from 'react';

import ThemeToggle from './ThemeToggle';

import './../styles/header.scss';

import iconInfo from './../images/info.svg';

const Header = (props) => {

    const { toggleLightDark, isDarkMode, toggleInfoPage } = props;

    return (
        <header className={`header ${isDarkMode ? 'dark' : ''}`}>
            <div className="header--theme-toggle">
                <ThemeToggle 
                    toggleLightDark={toggleLightDark}
                    isDarkMode={isDarkMode}
                />
            </div>
            <button className="header--icon" aria-label="Info">
                <img 
                    src={iconInfo}
                    alt="more info"
                    onClick={() => toggleInfoPage()}
                ></img>
            </button>
        </header>
    )
};

export default Header;