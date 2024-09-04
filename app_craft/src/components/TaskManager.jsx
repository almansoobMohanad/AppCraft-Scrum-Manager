import React, { useState } from 'react';
import CreateTaskButton from './CreateTaskButton.jsx';
import AddTaskOverlay from '/AddTaskOverlay.jsx';

const TaskManager = () => {
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const handleCreateButtonClick = () => {
        setOverlayVisible(true);
    };

    const handleOverlayClose = () => {
        setOverlayVisible(false);
    };

    const handleTaskSave = (task) => {
        console.log('Task saved:', task);  // Example save logic
        setOverlayVisible(false);
    };

    return (
        <div>
            <CreateTaskButton onClick={handleCreateButtonClick} />
            {isOverlayVisible && (
                <AddTaskOverlay onClose={handleOverlayClose} onSave={handleTaskSave} />
            )}
        </div>
    );
};

export default TaskManager;
