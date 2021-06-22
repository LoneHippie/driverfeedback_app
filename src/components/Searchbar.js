import React, { useState } from 'react';

import './../styles/searchbar.scss';

import iconSearchDark from './../images/search-dark.svg';
import iconSearchLight from './../images/search-light.svg';

const Searchbar = (props) => {

    const { drivers, getDrivers, toggleCreateForm, isDarkMode } = props;

    const [ search, setSearch ] = useState('');

    //handles value change for searchbar input
    function handleChangeSearch (e) {
        let value = e.target.value;
        //regex to filter out all characters except single spaces, dashes and alphanumerics
        value = value.replace(/[^a-zA-Z0-9\-\s]/ig, '').toUpperCase();
        value = value.replace(/  +/g, ' ');

        setSearch(value);
    };

    //returns array of plates that include the current search term
    const filteredPlates = drivers?.filter(el => el.plateNumber.includes(search));

    //wrapper function to autofill searchbar when clicking on a suggestion
    function handleSingleSelect(e, result) {
        getDrivers(e, result);
        setSearch(result.plateNumber);
    };

    //wrapper function to clear or autofill searchbar on form submit
    function handleMultipleSelect(e, results) {
        if (search !== '' && search !== ' ' && search !== '-') {
            getDrivers(e, results);

            //if only a single suggestion is present, autofill on search. Otherwise clear searchbar
            if (results.length === 1) {
                setSearch(results[0].plateNumber);
            } else {
                setSearch('');
            }
        } else {
            e.preventDefault();
        }
    };

    //generates searchbar results based on searchbar input value
    const searchResults = () => {

        //conditional render of blank element for blank or invalid search
        if (search.length === 0 || search === ' ' || search === '-') {
            return <></>
        } else {
            //conditional render for no found results
            if (!filteredPlates?.length) {
                return <div className={`no-results ${isDarkMode ? 'dark' : ''}`} onClick={() => toggleCreateForm()}>
                    Can't find a license plate? Click here to add it to our list!
                </div>
            } else {
                return filteredPlates?.map((el, index) => 
                    <li 
                        className={`result--plate ${isDarkMode ? 'dark' : ''}`}
                        style={{display: el.plateNumber === search ? 'none' : 'block'}}
                        key={`plate-${index}`}
                        onClick={(e) => handleSingleSelect(e, el)}
                    >
                        {el.plateNumber}
                    </li>
                )
            }
        }
    };

    return (
        <>
            <form 
                className="search"
                id="driversearch"
                autoComplete="off"
                onSubmit={(e) => handleMultipleSelect(e, filteredPlates)}
            >
                <div className="searchbar">
                    <input
                        className={`searchbar--field ${isDarkMode ? 'dark' : ''}`}
                        id="searchbar"
                        type="text"
                        placeholder="License plate"
                        value={search}
                        onChange={(e) => handleChangeSearch(e)}
                    >
                    </input>
                    <button 
                        className={`searchbar--button ${isDarkMode ? 'dark' : ''}`}
                        type="submit" 
                        form="driversearch"
                    >
                        <img 
                            className="searchbar--button-image"
                            src={isDarkMode ? iconSearchDark : iconSearchLight} 
                            alt="search license plates"
                        ></img>
                    </button>
                </div>

                <ul className={`results ${isDarkMode ? 'dark' : ''}`}>
                    {searchResults()}
                </ul>
            </form>
        </>
    );
};

export default Searchbar;