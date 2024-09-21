import React, { useState } from 'react';
import CreateSprintOverlay from './components/createSprint.jsx';
import NavigationBar from "../../components/NavigationBar";
import './SprintBoard.css'; 
import createSprint from './components/sprintDatabaseLogic.jsx'; //import the createSprint function

const SprintBoard = () => { 
    const [sprints, setSprints] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

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
        //takes in the updatedSprint places it on the old sprint
        const updatedSprints = sprints.map(sprint => 
            sprint.id === sprintID ? { ...sprint, ...updatedSprint } : sprint
        );
        setSprints(updatedSprints);
        
        console.log('sprint id from handle sprint', sprintID)

        //EDITING the sprint data on database should be here

    }

    const mockUpdatedSprint = {
        name: 'Updated Mock Sprint',
        startDate: '2024-09-05',
        endDate: '2024-09-20',
        productOwner: 'Jane Smith',
        members: ['Charlie', 'Dave'],
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
                            <button onClick={() => handleEditSprint(sprint.id, mockUpdatedSprint)}>Temp Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SprintBoard;
