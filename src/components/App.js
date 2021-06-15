import React, { useState, useEffect } from 'react';

import Header from './Header';

import './../styles/base.scss';

import Searchbar from './Searchbar';

const App = () => {

    const [ drivers, setDrivers ] = useState(undefined);
    const [ plateList, setPlateList ] = useState(undefined);

    useEffect(() => {
        fetch('https://driverfeedback.herokuapp.com/api/v1/drivers')
            .then(res => res.json())
            .then(data => {
                setDrivers(data.data.data);
            })
    }, []);

    useEffect(() => {
        if (drivers !== undefined) {
            let plateArr = [];

            drivers.forEach(el => plateArr.push(el.plateNumber));

            setPlateList(plateArr);
        }
    }, [drivers]);

    return (
        <div>
            <Header />

            <h1 className="title">Driver Feedback</h1>

            <Searchbar 
                drivers={drivers}
                plateList={plateList}
            />
        </div>
    )
};

export default App;