import React from 'react';

import './../styles/driverform.scss';

const DriverForm = (props) => {

    const { 
        formHandlers, 
        formPlate, 
        plateCountry,
        countrySearch,
        countriesList,
        stateSearch,
        stateList,
        isDarkMode 
    } = props;

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

    return (
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
    )
};

export default DriverForm;