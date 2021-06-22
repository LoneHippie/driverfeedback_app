import React from 'react';

import './../styles/commentform.scss';

const CommentForm = (props) => {

    const { 
        isDarkMode, 
        formHandlers, 
        formComment, 
        title, 
        onlyComment, 
        toggleCommentOpen, 
        submitComment, 
        authMessage 
    } = props;

    const commentEnums = [
        'Driver Issue', 'Car Issue', 'Parking', 'Accident'
    ];

    const commentTypeGrid = () => {

        return commentEnums.map((el, index) =>
            <button
                className={`comment-form__types--tag ${isDarkMode ? 'dark' : ''}`}
                id={`type-${el}`}
                key={`comment-type-${index}`}
                type="button"
                aria-label={`${el}`}
                onClick={() => formHandlers.changeCommentType(el)}
            >
                {el}
            </button>
        )
    };

    return (
        <form
            className="comment-form"
            id="comment-form"
        >

            <h2 className="comment-form__title">{title}</h2>

            <textarea
                required={true}
                className={`comment-form__textarea ${isDarkMode ? 'dark' : ''}`}
                rows="3"
                minLength="4"
                maxLength="200"
                id="comment-form-comment"
                value={formComment ?? ''}
                onChange={(e) => formHandlers.changeComment(e)}
                placeholder="Your comment"
                aria-label="Comment or feedback"
            >
            </textarea>

            <div className="comment-form__types">
                {commentTypeGrid()}
            </div>

            {
                onlyComment ? (
                    <>
                        {
                            authMessage ? (
                                <span className="auth-message--comment">
                                    {authMessage}
                                </span>
                            ) : (
                                <></>
                            )
                        }

                        <div className="comment-options">

                            <button 
                                className={`${isDarkMode ? 'dark' : ''}`} 
                                type="button" 
                                aria-label="Submit comment"
                                onClick={(e) => submitComment(e)}
                            >Upload</button>

                            <button 
                                className={`${isDarkMode ? 'dark' : ''}`} 
                                type="button" 
                                aria-label="Cancel"
                                onClick={() => toggleCommentOpen()}
                            >Cancel</button>

                        </div>
                    </>
                ) : (
                    <></>
                )
            }

        </form>
    )
};

export default CommentForm;