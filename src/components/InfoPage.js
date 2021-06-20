import React from 'react';

import PeaksLight from './../images/peaks-light.svg';
import PeaksDark from './../images/peaks-dark.svg';

import './../styles/infopage.scss';

const InfoPage = (props) => {

    const { isDarkMode } = props;

    return (
        <div className={`info-page ${isDarkMode ? 'dark' : ''}`}>

            <p>Driver Feedback is a web app for uploading and checking user provided info about cars and drivers. See someone driving with broken break lights? Someone with damage under the car they might've missed? Search for their license plate to leave a comment or add it yourself and let them know!</p>

            <p>This website uses the public Driver Feedback API</p>

            <span>Created by </span>
            <h2>Jordan Hlebechuk © 2021</h2>

            <div className="info-page__links">
                <a href="https://github.com/LoneHippie/driverfeedback_app" target="_blank" rel="noopener noreferrer">
                    App Repo
                </a>
                <a href="https://github.com/LoneHippie/driverfeedback_api" target="_blank" rel="noopener noreferrer">
                    API Repo
                </a>
            </div>

            <img
                className="info-page__background"
                src={isDarkMode ? PeaksDark : PeaksLight}
                alt="wavy peak vectors"
            ></img>
        </div>
    )
};

export default InfoPage;