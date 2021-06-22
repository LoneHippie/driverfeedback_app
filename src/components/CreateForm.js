import React, { useEffect, useState } from 'react';

import DriverForm from './DriverForm';
import CommentForm from './CommentForm';

import './../styles/createform.scss';

const CreateForm = (props) => {

    const { toggleCreateForm, isDarkMode } = props;

    const [ countriesList, setCountriesList ] = useState(undefined);
    const [ stateList, setStateList ] = useState(undefined);

    const [ countrySearch, setCountrySearch ] = useState('');
    const [ stateSearch, setStateSearch ] = useState('');

    const [ formPlate, setFormPlate ] = useState('');
    const [ plateCountry, setPlateCountry ] = useState(undefined);
    const [ plateState, setPlateState ] = useState(undefined);

    const [ formComment, setFormComment ] = useState('');
    const [ formCommentType, setFormCommentType ] = useState('');

    const [ authMessage, setAuthMessage ] = useState(undefined);

    const formHandlers = {
        changePlate: (e) => {
            let value = e.target.value;
            //regex to filter out all characters except single spaces, dashes and alphanumerics
            value = value.replace(/[^a-zA-Z0-9\-\s]/ig, '').toUpperCase();
            value = value.replace(/  +/g, ' ');

            setFormPlate(value);
        },
        changeCountrySearch: (e) => {
            let value = e.target.value;

            value = value.replace(/[^a-zA-Z\-\s]/ig, '');
            value = value.replace(/  +/g, ' ');

            setCountrySearch(value);
        },
        changeStateSearch: (e) => {
            let value = e.target.value;

            value = value.replace(/[^a-zA-Z\-\s]/ig, '');
            value = value.replace(/  +/g, ' ');
            
            setStateSearch(value);
        },
        changeCountry: (country) => {
            setPlateCountry(country.code);
            setCountrySearch(country.name);
            //load state list JSON if US is selected
            if (country.code === 'US' && stateList === undefined) {
                getStateList();
            }
        },
        changeState: (state) => {
            setPlateState(state.code);
            setStateSearch(state.name);
        },
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

    //on first load during session, fetch list of countries and codes from local json file
    useEffect(() => {
        if (countriesList === undefined) {
            fetch('countries.json', {
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then (resJson => setCountriesList(resJson))
        }
    }, [countriesList]);

    //fetches json array of states and abbreviations
    async function getStateList() {
        fetch('states.json', {
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then (resJson => setStateList(resJson))
    };

    //will selectively submit form data from both DriverForm and CommentForm based on what is filled out
    async function submitDriver(e) {
        e.preventDefault();

        try {
            if (formPlate.length < 3) {
                throw new Error('Plate number too short');
            };

            if (plateCountry === undefined) {
                throw new Error('Please select a country');
            };

            if (plateCountry === 'US' && plateState === undefined) {
                throw new Error('Please select a state');
            };

            if (formComment !== '' && formCommentType === '') {
                throw new Error('Please select a tag for your comment');
            };

            if (formCommentType !== '' && formComment === '') {
                throw new Error('Please write a comment for your tag');
            };

            const driverBody = () => {
                if (plateCountry === 'US') {
                    return {
                        'plateNumber': formPlate.trim(),
                        'country': plateCountry,
                        'state': plateState
                    }
                } else {
                    return {
                        'plateNumber': formPlate.trim(),
                        'country': plateCountry
                    }
                }
            };

            const commentBody = () => {
                if (formComment !== '' && formCommentType !== '') {
                    return {
                        'comment': formComment,
                        'commentType': formCommentType
                    }
                } else {
                    return false;
                }
            };
    
            const newDriver = await fetch('https://driverfeedback.herokuapp.com/api/v1/drivers', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(driverBody())
            });
    
            const driverResponse = await newDriver.json();

            if (driverResponse.status === 'fail' || driverResponse.status === 'error') {
                throw new Error('License plate upload failed');
            };

            setAuthMessage('Driver info added');

            if (commentBody() !== false) {

                setAuthMessage('Uploading comment...');

                const newComment = await fetch(`https://driverfeedback.herokuapp.com/api/v1/drivers/${driverResponse.data.data.id}/comments`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(commentBody())
                });

                const commentResponse = await newComment.json();

                if (commentResponse.status === 'fail' || commentResponse.status === 'error') {
                    throw new Error('Feedback upload failed');
                };

                setAuthMessage('Comment uploaded');
            };

            window.location.reload();

        } catch(err) {
            console.log('post error occured:');

            setAuthMessage(err.message);
        }   
    };

    return (
        <div className={`newdriver-page ${isDarkMode ? 'dark' : ''}`}>

            <button 
                aria-label="Close"
                className={`close-newdriver-page ${isDarkMode ? 'dark' : ''}`}
                onClick={() => toggleCreateForm()}
            >X</button>

            <div className="example-plate">

                <span className={`example-plate--country ${isDarkMode ? 'dark' : ''}`}>
                    {plateCountry ? plateCountry : '??'}
                </span>

                <div className="example-plate--license">
                    {formPlate !== '' && formPlate !== ' ' ? formPlate : 'XX-XXXX'}
                </div>

                {
                    plateCountry === 'US' ? (
                        <span className={`example-plate--state ${isDarkMode ? 'dark' : ''}`}>
                            {plateState ? plateState : '??'}
                        </span>
                    )  : (
                        <></>
                    )
                }

            </div>

            <DriverForm 
                formHandlers={formHandlers}
                formPlate={formPlate}
                plateCountry={plateCountry}
                countrySearch={countrySearch}
                countriesList={countriesList}
                stateSearch={stateSearch}
                stateList={stateList}
                isDarkMode={isDarkMode}
            />

            <CommentForm 
                onlyComment={false}
                formHandlers={formHandlers}
                formComment={formComment}
                title={'Feedback (optional)'}
                isDarkMode={isDarkMode}
            />

            {
                authMessage ? (
                    <div className="auth-message--newdriver">
                        {authMessage}
                    </div>
                ) : (
                    <></>
                )
            }

            <button
                aria-label="Submit"
                className="newdriver__btn"
                onClick={(e) => submitDriver(e)}
            >
                Upload
            </button>

        </div>
    )
};

export default CreateForm;