import React, { useEffect , useState } from 'react';
import CreateSprintOverlay from './components/createSprint.jsx';
import EditSprintOverlay from './components/editSprint.jsx';
import NavigationBar from "../../components/NavigationBar";
import './SprintBoard.css'; 
import createSprint from './components/sprintDatabaseLogic.jsx'; //import the createSprint function
import { editSprintDetails }  from './components/sprintDatabaseLogic.jsx';
import SprintTable from './components/sprintTable'; // Import the SprintTable component
import { fetchSprints } from './components/sprintDatabaseLogic.jsx';
import { deleteSprint } from './components/sprintDatabaseLogic.jsx';

const dummySprints = [
    {
        id: '1',
        name: 'Sprint 1',
        status: 'Completed'
    },
    {
        id: '2',
        name: 'Sprint 2',
        status: 'Active'
    },
    {
        id: '3',
        name: 'Sprint 3',
        status: 'Not Started'
    }
];

const SprintBoard = () => { 
    //all sprints in this page are stored here
    const [sprints, setSprints] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [tasksInSprint, setTasksInSprint] = useState([]);

    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null); // Track sprint being edited


    useEffect(() => {
        // Fetch sprints from the server
        const fetchAndSetSprints = async () => {
            const fetchedSprints = await fetchSprints();
            setSprints(fetchedSprints);
        };
        fetchAndSetSprints();
    }, []); // Empty dependency array ensures this runs only once   

    const handleViewTasksInSprint = (sprintID) => {
        console.log("View tasks in sprint with ID:", sprintID);
        setSelectedSprint(sprintID); // Set the selected sprint

        // Fetch tasks in the selected sprint
        const taskInSprint = sprints.tasks.array.forEach(element => { // Get the tasks array from the selected sprint
            console.log(element);
            setTasksInSprint([...tasksInSprint, element]);
        });
    };

    // Frontend-only deletion logic
    const handleDeleteSprint = (sprintID) => {
        // Filter out the sprint with the given ID
        const updatedSprints = sprints.filter(sprint => sprint.id !== sprintID);
        setSprints(updatedSprints);
        console.log(`Sprint with ID ${sprintID} deleted (frontend only).`);

        // Backend deletion logic
        deleteSprint(sprintID); // Delete the sprint from the database


    };

    const handleCreateSprint = async (newSprint) => {
        try {
            const sprintID = await createSprint(newSprint); // Get the Firestore document ID
            setSprints([...sprints, { ...newSprint, id: sprintID }]); // Save the sprint with the Firestore document ID
            console.log(sprints, newSprint);
        } catch (error) {
            console.error("Error creating sprint:", error);
        }
    };

    // Takes in a sprintID (already inside the sprint) and updatedSprint (should be from the edit overlay)
    const handleEditSprint = async (sprintID, updatedSprint) => {
        const updatedSprints = sprints.map(sprint => 
            sprint.id === sprintID ? { ...sprint, ...updatedSprint } : sprint
        );
        //update the local sprints array/list
        setSprints(updatedSprints);
        setShowEditOverlay(false); // Close overlay after saving changes

        //find the sprint on the db using the sprintID
        const databaseSprint = editSprintDetails(sprintID);

        //update the sprint on the cloud database
        try {
            if (updatedSprint.name) await databaseSprint.changeName(updatedSprint.name);
            if (updatedSprint.startDate) await databaseSprint.changeStartDate(updatedSprint.startDate);
            if (updatedSprint.endDate) await databaseSprint.changeEndDate(updatedSprint.endDate);
            if (updatedSprint.status) await databaseSprint.changeStatus(updatedSprint.status);
            if (updatedSprint.reference) await databaseSprint.changeReference(updatedSprint.reference);
            if (updatedSprint.productOwner) await databaseSprint.changeOwner(updatedSprint.productOwner);
            if (updatedSprint.scrumMaster) await databaseSprint.changeMaster(updatedSprint.scrumMaster);
            if (updatedSprint.members) await databaseSprint.changeMembers(updatedSprint.members)
        } catch (error) {
            console.error("Error updating sprint:", error);
        }
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

                {/* Use the SprintTable component */}
                <SprintTable 
                    sprints={sprints} 
                    onEditSprint={(sprint) => {
                        setSelectedSprint(sprint);
                        setShowEditOverlay(true);
                    }}
                    onDeleteSprint={handleDeleteSprint}
                />
            </div>
        </div>
    );
};

export default SprintBoard;
