import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Firestore config
import '../css/sprintTable.css';

const SprintTable = ({ onEditSprint, onDeleteSprint, onStartSprint }) => {
  const [sprints, setSprints] = useState([]);
  const navigate = useNavigate();

  const handleStartSprint = (sprintToStart) => {
    const activeSprintExists = sprints.some((sprint) => sprint.status === 'Active');

    if (activeSprintExists) {
      alert('An active sprint is already in progress. Please finish the ongoing sprint before starting a new one.');
      return; // Prevent starting a new sprint
    }

    // If no active sprint exists, start the selected sprint
    updateSprintInFirestore(sprintToStart.id, 'Active');
    console.log(`Sprint ${sprintToStart.name} started`);
  };
  // Function to update Firestore with new sprint status
  const updateSprintInFirestore = async (sprintId, updatedStatus) => {
    try {
      const sprintDocRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintDocRef, {
        status: updatedStatus,
      });
      console.log(`Sprint ${sprintId} updated to ${updatedStatus} in Firestore`);
    } catch (error) {
      console.error('Error updating sprint in Firestore:', error);
    }
  };

  // Function to check if the sprint should be activated
  const checkAndUpdateSprintStatus = (sprints) => {
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local time
    console.log('Current date:', currentDate);
    // First, check if any active sprints need to be finished
    sprints.forEach((sprint) => {
      if (sprint.status === 'Active' && sprint.endDate <= currentDate) {
        // Update Firestore status to 'Finished'
        updateSprintInFirestore(sprint.id, 'Finished');
        console.log(`Sprint ${sprint.name} finished`); 
        console.log(sprint.endDate);
      }
    });

    // Then, check if any "Not Active" sprints need to be activated
    const activeSprintExists = sprints.some(sprint => sprint.status === 'Active');
    if (activeSprintExists) {
      console.log('An active sprint already exists. No updates will be made.');
      return;
    }

    sprints.forEach((sprint) => {
      if (sprint.status === 'Not Active' && sprint.startDate <= currentDate) {
        // Update Firestore status to 'Active'
        updateSprintInFirestore(sprint.id, 'Active');
        console.log(`Sprint ${sprint.name} activated`);
      }
    });
  };

  // Use useEffect to set up real-time listener for sprints collection
  useEffect(() => {
    const sprintsCollectionRef = collection(db, 'sprints');
    const unsubscribe = onSnapshot(sprintsCollectionRef, (snapshot) => {
      const sprintsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSprints(sprintsData);
      checkAndUpdateSprintStatus(sprintsData);
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const handleViewSprint = (sprint) => {
    if (sprint.status === 'Not Active') {
      navigate('/sprintplan/', { state: { sprint } });
    } else if (sprint.status === 'Active' || sprint.status === 'Finished') {
      navigate('/sprintbacklog/', { state: { sprintId: sprint.id, sprintName: sprint.name, sprintTask: sprint.tasks , sprintStatus: sprint.status} });
    }
  };

  return (
    <table className="sprint-table">
      <thead>
        <tr>
          <th>Sprint Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sprints.map((sprint) => {
          const status = sprint.status ? sprint.status.toLowerCase().replace(/\s+/g, '-') : 'not-active'; // Ensure default status

          return (
            <tr key={sprint.id}>
              <td>{sprint.name}</td>
              <td>
                <span className={`status-text status-${status}`}>
                  {sprint.status || 'Not Active'}
                </span>
              </td>
              <td className="actions-column">
                <button className="view-sprint-btn" onClick={() => handleViewSprint(sprint)}>
                  View Sprint
                </button>

                {sprint.status === 'Not Active' && (
                  <button className="start-sprint-btn" onClick={() => handleStartSprint(sprint)}>
                    Start Sprint
                  </button>
                )}

                {sprint.status !== 'Finished' && (
                  <button className="edit-sprint-btn" onClick={() => onEditSprint(sprint)}>
                    Edit Sprint
                  </button>
                )}

                <button className="delete-sprint-btn" onClick={() => onDeleteSprint(sprint.id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SprintTable;