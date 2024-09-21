import React, { useState } from 'react';
import CreateSprintOverlay from './components/createSprint.jsx';
import EditSprintOverlay from './components/editSprint.jsx';
import NavigationBar from "../../components/NavigationBar";
import './SprintBoard.css'; 
import createSprint from './components/sprintDatabaseLogic.jsx'; //import the createSprint function

const SprintBoard = () => { 
    const [sprints, setSprints] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null); // Track sprint being edited


    const handleCreateSprint = async (newSprint) => {
        try {
            const sprintID = await createSprint(newSprint); // Get the Firestore document ID
            setSprints([...sprints, { ...newSprint, id: sprintID }]); // Save the sprint with the Firestore document ID
            console.log(sprints, newSprint);
        } catch (error) {
            console.error("Error creating sprint:", error);
        }
    };

    //takes in a sprintID (already inside the sprint) and updatedSprint (should be from the edit overlay)
    const handleEditSprint = (sprintID, updatedSprint) => {
        const updatedSprints = sprints.map(sprint => 
            sprint.id === sprintID ? { ...sprint, ...updatedSprint } : sprint
        );
        setSprints(updatedSprints);
        setShowEditOverlay(false); // Close overlay after saving changes
    };


    return (
        <div className="sprintBoard-container">
            <NavigationBar /> {/* Add the NavigationBar component */}
            <div className="content">
                <h1 className="title">Sprint Board</h1>
                <button className='create-sprint-button'
                onClick={() => setShowOverlay(true)}>Create Sprint</button>
                
                {/* Create Sprint Overlay */}
                {showOverlay && (
                    <CreateSprintOverlay 
                        onCreate={handleCreateSprint} 
                        onClose={() => setShowOverlay(false)} 
                    />
                )}

                {/* Edit Sprint Overlay */}
                {showEditOverlay && selectedSprint && (
                    <EditSprintOverlay 
                        sprintDetails={selectedSprint}
                        onEdit={(updatedSprint) => handleEditSprint(selectedSprint.id, updatedSprint)} 
                        onClose={() => setShowEditOverlay(false)} 
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
                            {/* Button to trigger the Edit Sprint Overlay */}
                            <button className="edit-sprint-button" onClick={() => {
                                setSelectedSprint(sprint); // Set the sprint for editing
                                setShowEditOverlay(true);  // Open the edit overlay
                            }}>Edit Sprint Details</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SprintBoard;
