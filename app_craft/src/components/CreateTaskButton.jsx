import * as React from 'react';

const CreateTaskButton = ({ onClick }) => {
    return (
        <div>
            <button type="button" onClick={onClick}>
                Create
            </button>
        </div>
    );
};

export default CreateTaskButton;
