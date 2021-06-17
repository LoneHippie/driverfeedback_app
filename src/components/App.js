import React, { useState, useEffect } from 'react';

import Header from './Header';
import DriverGrid from './DriverGrid';
import CreateForm from './CreateForm';

import './../styles/base.scss';

import Searchbar from './Searchbar';

const App = () => {

    //state for all driver data
    const [ drivers, setDrivers ] = useState(undefined);

    //fetch all driver data and set to driver state
    useEffect(() => {
        fetch('https://driverfeedback.herokuapp.com/api/v1/drivers')
            .then(res => res.json())
            .then(data => {
                setDrivers(data.data.data);
            });
    }, []);

    //state for search results to be passed to grid
    const [ driverResults, setDriverResults ] = useState([]);

    function getDrivers (e, results) {
        e.preventDefault();

        if (!results.length) { //if search result is a single element, return as in array format
            setDriverResults([results]);
        } else {
            setDriverResults(results);
        }
    };

    const [ createFormOpen, setCreateFormOpen ] = useState(false);

    function toggleCreateForm() {
        setCreateFormOpen(!createFormOpen);
    };

    const [ isDarkMode, setIsDarkMode ] = useState(false);

    //default to light theme for initial visits
    useEffect(() => {
        if (localStorage.getItem('theme') === null) {
            localStorage.setItem('theme', 'light');
        };

        if (localStorage.getItem('theme') === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        }
    }, []);

    //change isDarkMode state and update localstorage item
    function toggleLightDark(e) {
        setIsDarkMode(e.target.checked);

        //update local storage and modify css class for body
        if (localStorage.getItem('theme') === 'light') {
            localStorage.setItem('theme', 'dark');
            document.body.classList.add('dark');
        } else {
            localStorage.setItem('theme', 'light');
            document.body.classList.remove('dark');
        }
    };

    return (
        <>
            <Header
                toggleLightDark={toggleLightDark}
                isDarkMode={isDarkMode}
            />

            <h1 className={`title ${isDarkMode ? 'dark' : ''}`}>Driver Feedback</h1>

            <Searchbar 
                drivers={drivers}
                getDrivers={getDrivers}
                toggleCreateForm={toggleCreateForm}
                isDarkMode={isDarkMode}
            />

            <DriverGrid 
                driverResults={driverResults}
                isDarkMode={isDarkMode}
            />

            {
                createFormOpen ? (
                    <CreateForm 
                        toggleCreateForm={toggleCreateForm}
                    />
                ) : (
                    <></>
                )
            }
        </>
    )
};

export default App;