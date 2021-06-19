import React, { useEffect, useState } from 'react';

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
            let typeTags = document.getElementsByClassName('driver-form__types--tag');
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

    const filteredCountries = countriesList?.filter(el => {
        //check list of valid country names against search term (end spaces removed and cap/low agnostic)
        if (el.name.toLowerCase().includes(countrySearch.toLowerCase().trimEnd())) {
            return el;
        }
    });

    const countrySearchResults = () => {

        //conditional render of blank element for blank or invalid search
        if (countrySearch.length === 0 || countrySearch === ' ' || countrySearch === '-') {
            return <></>
        } else {
            //conditional render for no found results
            if (!filteredCountries?.length) {
                return <></>
            } else {
                return filteredCountries?.map((el, index) => 
                    <li 
                        className={`driver-form__results--item ${isDarkMode ? 'dark' : ''}`}
                        style={{display: el.name === countrySearch ? 'none' : 'block'}}
                        key={`country-${index}`}
                        onClick={() => formHandlers.changeCountry(el)}
                    >
                        {el.name}
                    </li>
                )
            }
        }
    };

    const filteredStates = stateList?.filter(el => {
        //check list of valid country names against search term (end spaces removed and cap/low agnostic)
        if (el.name.toLowerCase().includes(stateSearch.toLowerCase().trimEnd())) {
            return el;
        }
    });

    const stateSearchResults = () => {

        //conditional render of blank element for blank or invalid search
        if (stateSearch.length === 0 || stateSearch === ' ' || stateSearch === '-') {
            return <></>
        } else {
            //conditional render for no found results
            if (!filteredStates?.length) {
                return <></>
            } else {
                return filteredStates?.map((el, index) => 
                    <li 
                        className={`driver-form__results--item ${isDarkMode ? 'dark' : ''}`}
                        style={{display: el.name === stateSearch ? 'none' : 'block'}}
                        key={`state-${index}`}
                        onClick={() => formHandlers.changeState(el)}
                    >
                        {el.name}
                    </li>
                )
            }
        }
    };

    const commentEnums = [
        'Driver Issue', 'Car Issue', 'Parking', 'Accident'
    ];

    const commentTypeGrid = () => {

        return commentEnums.map((el, index) =>
            <button
                className="driver-form__types--tag"
                id={`type-${el}`}
                key={`comment-type-${index}`}
                type="button"
                onClick={() => formHandlers.changeCommentType(el)}
            >
                {el}
            </button>
        )
    };

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
                    //add ui feedback later in catch block
                };

                setAuthMessage('Comment uploaded');
            };

            window.location.reload();

        } catch(err) {
            console.log('post error occured:');
            console.log(err);

            setAuthMessage(err.message);
        }   
    };

    //add searchbar that works same as the home one for countries and states, but with a max height and scroll
    //only update state for one of these if an option is explicitly clicked. don't use input text value

    return (
        <div className={`newdriver-page ${isDarkMode ? 'dark' : ''}`}>

            <button 
                className="close-newdriver-page"
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

            <form
                className="driver-form"
                id="driver-form"
            >

                <h2 className="driver-form__title">License Plate Info</h2>

                <input
                    required={true}
                    className={`driver-form__input ${isDarkMode ? 'dark' : ''}`} 
                    type="text" 
                    autoComplete="off"
                    id="driver-form-plate"
                    value={formPlate}
                    pattern="([A-z0-9À-ž\s]){4,10}"
                    maxLength="9"
                    onChange={(e) => formHandlers.changePlate(e)}
                    placeholder="License Plate"
                >
                </input>

                <div className={`driver-form__search`}>

                    <input
                        required={true}
                        className={`driver-form__input ${isDarkMode ? 'dark' : ''}`} 
                        type="text" 
                        autoComplete="off"
                        id="driver-form-country"
                        value={countrySearch}
                        pattern="([A-zÀ-ž\s]+)"
                        onChange={(e) => formHandlers.changeCountrySearch(e)}
                        placeholder="Country"
                    >
                    </input>

                    <ul className={`driver-form__results ${isDarkMode ? 'dark' : ''}`}>
                        {countrySearchResults()}
                    </ul>

                </div>

                {
                    plateCountry === 'US' ? (
                        <div className={`driver-form__search`}>

                            <input
                                required={true}
                                className={`driver-form__input ${isDarkMode ? 'dark' : ''}`} 
                                type="text" 
                                autoComplete="off"
                                id="driver-form-state"
                                value={stateSearch}
                                pattern="([A-zÀ-ž\s]+)"
                                onChange={(e) => formHandlers.changeStateSearch(e)}
                                placeholder="State"
                            >
                            </input>

                            <ul className={`driver-form__results ${isDarkMode ? 'dark' : ''}`}>
                                {stateSearchResults()}
                            </ul>

                        </div>
                    ) : (
                        <></>
                    )
                }

            </form>

            <form
                className="driver-form"
                id="comment-form"
            >

                <h2 className="driver-form__title">Feedback (optional)</h2>

                <textarea
                    required={true}
                    className="driver-form__textarea"
                    rows="3"
                    minLength="4"
                    maxLength="200"
                    id="driver-form-comment"
                    value={formComment}
                    onChange={(e) => formHandlers.changeComment(e)}
                    placeholder="Your comment"
                >
                </textarea>

                <div className="driver-form__types">
                    {commentTypeGrid()}
                </div>

            </form>

            {
                authMessage ? (
                    <div className={`auth-message ${isDarkMode ? 'dark' : ''}`}>
                        {authMessage}
                    </div>
                ) : (
                    <></>
                )
            }

            <button
                className="driver-form__btn"
                onClick={(e) => submitDriver(e)}
            >
                Upload
            </button>

        </div>
    )
};

export default CreateForm;