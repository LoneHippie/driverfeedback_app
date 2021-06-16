import React from 'react';

import DriverCardMini from './DriverCardMini';

import './../styles/drivergrid.scss';

const DriverGrid = (props) => {

    const { driverResults } = props;

    const driverCardGenerator = () => {
        //checks if empty array is returned or not
        if (Array.isArray(driverResults[0])) {
            return <></>
        } else {
            return driverResults.map((el, index) => 
                <DriverCardMini key={`card-mini-${index}`}
                    driver={el}
                    index={index}
                />
            )
        }
    };

    return (
        <section className="driver-grid">
            {driverCardGenerator()}
        </section>
    );
};

export default DriverGrid;