import * as React from 'react';

const CreateTaskButton = () => {
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

export default CreateTaskButton;