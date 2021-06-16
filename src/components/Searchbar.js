import React, { useState } from 'react';

import './../styles/searchbar.scss';

import iconSearch from './../images/search-dark.svg';

const Searchbar = (props) => {

    const { drivers, getDrivers } = props;

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
    const filteredPlates = drivers?.filter(el => {
        if (el.plateNumber.includes(search)) {
            return el;
        }
    });

    //wrapper function to autofill searchbar when clicking on a suggestion
    function handleSingleSelect(e, result) {
        getDrivers(e, result);
        setSearch(result.plateNumber);
    };

    //wrapper function to clear or autofill searchbar on form submit
    function handleMultipleSelect(e, results) {
        if (search !== '' && search !== ' ') {
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

        //conditional render of blank element for 0 results
        if (
            search.length === 0 || 
            search === ' ' || 
            search === '-' || 
            filteredPlates?.length === 0
        ) {
            return <></>
        } else {
            return filteredPlates?.map((el, index) => 
                <li 
                    className="result--plate"
                    style={{display: el.plateNumber === search ? 'none' : 'block'}}
                    key={`plate-${index}`}
                    onClick={(e) => handleSingleSelect(e, el)}
                >
                    {el.plateNumber}
                </li>
            )
        }
    };

    return (
        <>
            <form 
                className="search"
                id="driversearch"
                onSubmit={(e) => handleMultipleSelect(e, filteredPlates)}
            >
                <div className="searchbar">
                    <input
                        className="searchbar--field"
                        id="searchbar"
                        type="text"
                        value={search}
                        onChange={(e) => handleChangeSearch(e)}
                    >
                    </input>
                    <button 
                        className="searchbar--button"
                        type="submit" 
                        form="driversearch"
                    >
                        <img 
                            className="searchbar--button-image"
                            src={iconSearch} 
                            alt="search license plates"
                        ></img>
                    </button>
                </div>

                <ul className="results">
                    {searchResults()}
                </ul>
            </form>
        </>
    );
};

export default Searchbar;