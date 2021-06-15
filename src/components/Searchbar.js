import React, { useState } from 'react';

import './../styles/searchbar.scss';

const Searchbar = (props) => {

    const { plateList, drivers } = props;

    const [ search, setSearch ] = useState('');

    function handleChangeSearch (e) {
        let value = e.target.value;
        //regex to filter out all characters except single spaces, dashes and alphanumerics
        value = value.replace(/[^a-zA-Z0-9\-\s]/ig, '').toUpperCase();
        value = value.replace(/  +/g, ' ');

        setSearch(value);
    };

    const searchResults = () => {

        const filteredPlates = plateList?.filter(el => {
            let firstPass = el.includes(search);
    
            if (firstPass === true) {
                return el;
            }
        });

        if (search.length === 0 || filteredPlates?.length === 0) {
            return <></>
        } else {
            return filteredPlates?.map((el, index) => 
                <li 
                    className="result--plate"
                    key={`plate-${index}`}
                    // onClick={() => openDriver()}
                >
                    {el}
                </li>
            )
        }
    };

    return (
        <>
            <div className="search">
                <input
                    className="search-field"
                    type="text"
                    value={search}
                    onChange={(e) => handleChangeSearch(e)}
                >
                </input>
            </div>

            <ul className="results">
                {searchResults()}
            </ul>
        </>
    );
};

export default Searchbar;