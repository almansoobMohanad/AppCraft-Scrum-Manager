import React, { useState } from 'react';
import CreateSprintOverlay from './components/createSprint.jsx';
import NavigationBar from "../../components/NavigationBar";
import './SprintBoard.css'; 

const SprintBoard = () => {
    const [sprints, setSprints] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

    const handleCreateSprint = (newSprint) => {
        setSprints([...sprints, { ...newSprint, id: sprints.length + 1 }]);
    };

    return (
        <div className="sprintBoard-container">
            <NavigationBar /> {/* Add the NavigationBar component */}
            <div className="content">
                <h1 className="title">Sprint Board</h1>
                <button className='create-sprint-button'
                onClick={() => setShowOverlay(true)}>Create Sprint</button>
                {showOverlay && (
                    <CreateSprintOverlay 
                        onCreate={handleCreateSprint} 
                        onClose={() => setShowOverlay(false)} 
                    />
                )}
                <div className="sprints-list">
                    {sprints.map((sprint) => (
                        <div key={sprint.id} className="sprint-item">
                            <h3>{sprint.name}</h3>
                            <p><strong>Start Date:</strong> {sprint.startDate}</p>
                            <p><strong>End Date:</strong> {sprint.endDate}</p>
                            <p><strong>Product Owner:</strong> {sprint.productOwner}</p>
                            <p><strong>Members:</strong> {sprint.members.join(', ')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SprintBoard;
