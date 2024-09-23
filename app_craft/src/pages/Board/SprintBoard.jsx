import React, { useState } from 'react';
import CreateSprintOverlay from './components/createSprint.jsx';
import EditSprintOverlay from './components/editSprint.jsx';
import NavigationBar from "../../components/NavigationBar";
import './SprintBoard.css'; 
import SprintTable from './components/sprintTable'; // Import the SprintTable component

const dummySprints = [
    {
        id: '1',
        name: 'Sprint 1',
        status: 'Finished'
    },
    {
        id: '2',
        name: 'Sprint 2',
        status: 'Active'
    },
    {
        id: '3',
        name: 'Sprint 3',
        status: 'Not Active'
    }
];

const SprintBoard = () => { 
    const [sprints, setSprints] = useState(dummySprints);  // Use dummy data here
    const [showOverlay, setShowOverlay] = useState(false);
    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);

    return (
        <div className="sprintBoard-container">
            <NavigationBar />
            <div className="content">
                <h1 className="title">Sprint Board</h1>
                <button className='create-sprint-button' onClick={() => setShowOverlay(true)}>
                    Create Sprint
                </button>

                {showOverlay && (
                    <CreateSprintOverlay 
                        onCreate={(newSprint) => setSprints([...sprints, newSprint])} 
                        onClose={() => setShowOverlay(false)} 
                    />
                )}

                {showEditOverlay && selectedSprint && (
                    <EditSprintOverlay 
                        sprintDetails={selectedSprint}
                        onEdit={(updatedSprint) => {
                            const updatedSprints = sprints.map(sprint =>
                                sprint.id === selectedSprint.id ? { ...sprint, ...updatedSprint } : sprint
                            );
                            setSprints(updatedSprints);
                            setShowEditOverlay(false);
                        }} 
                        onClose={() => setShowEditOverlay(false)} 
                    />
                )}

                {/* Use the SprintTable component */}
                <SprintTable 
                    sprints={sprints} 
                    onEditSprint={(sprint) => {
                        setSelectedSprint(sprint);
                        setShowEditOverlay(true);
                    }}
                />
            </div>
        </div>
    );
};

export default SprintBoard;
