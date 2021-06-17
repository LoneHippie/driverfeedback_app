import React from 'react';

import './../styles/createform.scss';

const CreateForm = (props) => {

    const { toggleCreateForm } = props;

    //post function should limit license plate numbers to 10 characters max
    //license plate input should use same regex as search as will as .trim()
    //should have option to add 1 comment before posting

    return (
        <div className="create-form">

            <button 
                className="close-form"
                onClick={() => toggleCreateForm()}
            >X</button>

        </div>
    )
};

export default CreateForm;