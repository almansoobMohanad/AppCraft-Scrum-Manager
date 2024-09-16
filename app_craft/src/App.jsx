import { useState, useEffect } from 'react';
import CreateTaskButton from './components/CreateTaskButton.jsx';
import AddTaskOverlay from './components/AddTaskOverLay.jsx';
import EditTaskOverlay from './components/EditTaskOverLay.jsx';
import './cssFiles/App.css';
import NavigationBar from './components/NavigationBar.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig.js';
import { createTask } from "./services/tasksService"; // import task service
import CollapsibleTable from './components/TaskCardDetail.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import SortButton from './components/SortButton.jsx';  // Import SortButton
import localDB from './LocalDatabase.jsx';

function App() {
  // State to control overlay visibility
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]); // Manage all tasks
  const [sortedTasks, setSortedTasks] = useState([]); // Manage sorted tasks
  const [updateFlag, setUpdateFlag] = useState(false);

  const docRef = doc(db, 'tasks', 'Yn7xWRHWqZlKgEiWTo0n');

  // Function to handle the "Create" button click
  const handleCreateButtonClick = () => {
    setOverlayVisible(true);  // Show the overlay
  };

  // Function to handle closing the overlay
  const handleOverlayClose = () => {
    setOverlayVisible(false);  // Hide the overlay
    setUpdateFlag(!updateFlag);  // Update the flag to refresh the task list
  };

  const handleFilterChange = (criteria) => { 
    setFilterCriteria(criteria);
  };

  const handleTaskSave = async (task) => {
    try {
      const taskId = await createTask(task);
      console.log('Task created with ID:', taskId);
    } catch (error) {
      console.error('Error saving task:', error);
    }
    setOverlayVisible(false);
    setUpdateFlag(!updateFlag);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditOverlayVisible(true);
  };

  const handleEditOverlayClose = () => {
    setEditOverlayVisible(false);
    setUpdateFlag(!updateFlag);
  };

  const handleTaskEditSave = async (updatedTask) => {
    try {
      console.log('Task updated:', updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setEditOverlayVisible(false);
    setUpdateFlag(!updateFlag);
  };

  return (
    <div className="app-container">
      <NavigationBar />

      <div className="content">
        <h1 className="title">Product Backlog</h1>
        <div className="button-group">
          <CreateTaskButton onClick={handleCreateButtonClick} />
          {/* Add Sort Button */}
        </div>
        <CollapsibleTable updateFlag={updateFlag} /> 
      </div>

      {/* Conditionally render the AddTaskOverlay */}
      {isOverlayVisible && (
        <AddTaskOverlay onClose={handleOverlayClose} onSave={handleTaskSave} />
      )}

      {/* Conditionally render the EditTaskOverlay */}
      {isEditOverlayVisible && selectedTask && (
        <EditTaskOverlay
          task={selectedTask}
          onClose={handleEditOverlayClose}
          onSave={handleTaskEditSave}
        />
      )}
    </div>
  );
}

export default App;
