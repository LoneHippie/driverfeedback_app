import React from 'react';

import DriverCardFull from './DriverCardFull';

const DriverCardMini = (props) => {

    const { driver } = props;

    function toggleCard() {
        if (document.getElementById(`card-${driver.id}-full`).style.display === 'none') {
            document.getElementById(`card-${driver.id}-full`).style.display = 'block';
        } else {
            document.getElementById(`card-${driver.id}-full`).style.display = 'none';
        }
    };

    return (
        <>
            <div className="card-mini" id={`card-${driver.id}`} onClick={() => toggleCard()}>
                <span className="card-mini--plate">{driver.plateNumber}</span>

                <span className="card-mini--location">
                    {driver.country === 'USA' ? driver.state : driver.country}
                </span>
            </div>


            <DriverCardFull
                driver={driver}
                toggleCard={toggleCard}
            />

        </>
    );
};

export default DriverCardMini;