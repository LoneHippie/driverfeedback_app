import React, { useState, useEffect } from 'react';

import './../styles/themetoggle.scss';

const ThemeToggle = (props) => {

    const { toggleLightDark, isDarkMode } = props;

    const [ switchText, setSwitchText ] = useState(false);

    //set initial toggle UI based on localstorage
    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') {
            document.getElementById('switch').checked = true;
            setSwitchText(true);
        } else {
            document.getElementById('switch').checked = false;
            setSwitchText(false);
        }
    }, []);

    function toggleSwitch(e) {
        toggleLightDark(e);
        setSwitchText(e.target.checked);
    };

    return (
        <div className="switch">
            <input type="checkbox" id="switch" onClick={(e) => toggleSwitch(e)}/>
            <label className={`switch-label ${isDarkMode ? 'dark': ''}`} htmlFor="switch">Login</label>
            <span className={`switch-title ${isDarkMode ? 'dark' : ''}`}>{switchText ? 'Dark' : 'Light'}</span>
        </div>
    )
};

export default ThemeToggle; 