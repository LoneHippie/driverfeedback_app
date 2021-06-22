import React, { useState, useEffect } from 'react';

import CommentForm from './CommentForm';

const DriverCardFull = (props) => {

    const { driver, toggleCard, isDarkMode } = props;

    const [ driverDetails, setDriverDetails ] = useState(undefined);

    //get driver data on load
    useEffect(() => {
        fetch(`https://driverfeedback.herokuapp.com/api/v1/drivers/${driver.id}/comments`)
            .then(res => res.json())
            .then(data => setDriverDetails(data.data.data));
    }, [driver]);

    const [ commentOpen, setCommentOpen ] = useState(false);

    const [ formComment, setFormComment ] = useState('');
    const [ formCommentType, setFormCommentType ] = useState('');

    const [ authMessage, setAuthMessage ] = useState(undefined);

    const formHandlers = {
        changeCommentType: (tag) => { //refactor this later
            setFormCommentType(tag);

            //remove active class from all commentType tags
            let typeTags = document.getElementsByClassName('comment-form__types--tag');
            for (let i = 0; i < typeTags.length; i++) {
                typeTags[i].classList.remove('active');
                typeTags[i].classList.add('deactivated');
            };
            //add active class to match current commentType state
            document.getElementById(`type-${tag}`).classList.remove('deactivated')
            document.getElementById(`type-${tag}`).classList.add('active');
        },
        changeComment: (e) => {
            setFormComment(e.target.value);
        }
    };

    function toggleCommentOpen() {
        setCommentOpen(!commentOpen);
    };

    //wrapper function to toggle commentOpen when closing full display
    function toggleCardAndComment() {
        if (commentOpen) {
            setCommentOpen(false);
        };
        toggleCard();
    };

    async function submitComment(e) {
        e.preventDefault();

        try {
            if (formCommentType === '' && formComment === '') {
                throw new Error('Please add a comment and tag');
            };

            if (formComment !== '' && formCommentType === '') {
                throw new Error('Please select a tag for your comment');
            };

            if (formCommentType !== '' && formComment === '') {
                throw new Error('Please write a comment for your tag');
            };

            setAuthMessage('Uploading comment...');

            const commentBody = {
                'comment': formComment,
                'commentType': formCommentType
            };

            const newComment = await fetch(`https://driverfeedback.herokuapp.com/api/v1/drivers/${driver.id}/comments`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(commentBody)
            });

            const commentResponse = await newComment.json();

            if (commentResponse.status === 'fail' || commentResponse.status === 'error') {
                throw new Error('Comment upload failed');
            };

            setAuthMessage('Comment uploaded');

            window.location.reload();

        } catch(err) {
            console.log('post error occured');

            setAuthMessage(err.message);
        }
    };

    //converts comment timestamp into a more readable string
    const reformatedCommentDate = (originalDate) => {
        let commentDate = originalDate.createdAt;

        commentDate = commentDate.slice(0, -8);
        commentDate = commentDate.replace('T', ' ');

        return commentDate;
    };

    const driverComments = () => {
        if (driverDetails === undefined || Array.isArray(driverDetails[0]) || driverDetails?.length === 0) {
            return <div className={`no-comment ${isDarkMode ? 'dark' : ''}`}>There are no comments here yet</div>
        } else {
            return driverDetails?.map((el, index) =>
                <div className={`comment ${isDarkMode ? 'dark' : ''}`} key={`comment-${driver.id}-${index}`}>
                    <div className={`comment--type ${isDarkMode ? 'dark' : ''}`}>
                        {el.commentType}
                    </div>
                    <div className="comment--text">
                        {el.comment}
                    </div>
                    <div className={`comment--date ${isDarkMode ? 'dark' : ''}`}>
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
                onClick={() => toggleCardAndComment()}
            >X</button>

            <div className="card-full__plate" style={{marginBottom: commentOpen ? '4rem' : '0rem'}}>

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

            {
                commentOpen ? (
                    <CommentForm 
                        onlyComment={true}
                        toggleCommentOpen={toggleCommentOpen}
                        formHandlers={formHandlers}
                        formComment={formComment}
                        title={''}
                        submitComment={submitComment}
                        authMessage={authMessage}
                        isDarkMode={isDarkMode}
                    />
                ) : (
                    <div className="card-full--comments">
                        {driverComments()}

                        <button 
                            className={`add-comment ${isDarkMode ? 'dark' : ''}`}
                            onClick={() => toggleCommentOpen()}
                        >
                            Leave Feedback 
                        </button>
                    </div>
                )
            }

        </div>
    )
};

export default DriverCardFull;