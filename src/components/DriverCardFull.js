import React, { useState, useEffect } from 'react';

const DriverCardFull = (props) => {

    const { driver, toggleCard, isDarkMode } = props;

    const [ driverDetails, setDriverDetails ] = useState(undefined);

    useEffect(() => {
        fetch(`https://driverfeedback.herokuapp.com/api/v1/drivers/${driver.id}/comments`)
            .then(res => res.json())
            .then(data => setDriverDetails(data.data.data));
    }, [driver]);

    //converts comment timestamp into a more readable string
    const reformatedCommentDate = (originalDate) => {
        let commentDate = originalDate.createdAt;

        commentDate = commentDate.slice(0, -8);
        commentDate = commentDate.replace('T', ' ');

        return commentDate;
    };

    const driverComments = () => {
        if (driverDetails === undefined || Array.isArray(driverDetails[0])) {
            return <span>There are no comments here yet</span>
        } else {
            return driverDetails?.map((el, index) =>
                <div className={`comment ${isDarkMode ? 'dark' : ''}`} key={`comment-${driver.id}-${index}`}>
                    <div className="comment--type">
                        {el.commentType}
                    </div>
                    <div className="comment--text">
                        {el.comment}
                    </div>
                    <div className="comment--date">
                        {reformatedCommentDate(el)}
                    </div>
                </div>
            )
        }
    };

    return (
        <div className={`card-full ${isDarkMode ? 'dark' : ''}`} id={`card-${driver.id}-full`} style={{display: 'none'}}>

            <button 
                className="close-card"
                onClick={() => toggleCard()}
            >X</button>

            <div className="card-full__plate">

                <span className={`card-full__plate--country ${isDarkMode ? 'dark' : ''}`}>
                    {driver.country}
                </span>
                
                <div className="card-full__plate--license">
                    {driver.plateNumber}
                </div>

                {
                    driver.state ? (
                        <span className={`card-full__plate--state ${isDarkMode ? 'dark' : ''}`}>
                            {driver.state}
                        </span>
                    )  : (
                        <></>
                    )
                }

            </div>

            <div className="card-full--comments">
                {driverComments()}
            </div>

        </div>
    )
};

export default DriverCardFull;