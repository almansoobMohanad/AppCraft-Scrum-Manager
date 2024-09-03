import * as React from 'react';

const CreateButton = () => {
    const handleClick = () => {
        alert('Create button clicked!');
    };

    return (
        <div>
            <button type="button" onClick={handleClick}>
                Create
            </button>
        </div>
    );
    };

export default CreateButton;