import React from 'react';

import './../styles/createform.scss';

const CreateForm = (props) => {

    const { toggleCreateForm } = props;

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