import React, { useState, useEffect } from 'react';

import Header from './Header';
import DriverGrid from './DriverGrid';

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
            })
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

    return (
        <>
            <Header />

            <h1 className="title">Driver Feedback</h1>

            <Searchbar 
                drivers={drivers}
                getDrivers={getDrivers}
            />

            <DriverGrid 
                driverResults={driverResults}
            />
        </>
    )
};

export default App;