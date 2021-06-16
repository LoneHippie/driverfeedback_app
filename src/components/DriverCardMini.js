import React from 'react';

const DriverCardMini = (props) => {

    const { driver } = props;

    return (
        <div className="card-mini" id={`card-${driver.id}`}>
            <span className="card-mini--plate">{driver.plateNumber}</span>

            <span className="card-mini--location">
                {driver.country === 'USA' ? driver.state : driver.country}
            </span>
        </div>
    );
};

export default DriverCardMini;