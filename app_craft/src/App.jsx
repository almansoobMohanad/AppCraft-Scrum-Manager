import { useState, useEffect } from 'react';
import CreateTaskButton from './components/CreateTaskButton.jsx';
import AddTaskOverlay from './components/AddTaskOverlay.jsx';  // Import the overlay component
import EditTaskOverlay from './components/EditTaskOverLay.jsx';
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import Home from './pages/home.jsx';
import SaveButton from './components/SaveButton.jsx';
import {doc, getDoc} from 'firebase/firestore';
import {db} from './firebase/firebaseConfig.js';
import { createTask } from "./services/tasksService"; //import task service
import CollapsibleTable from './components/TaskCardDetail.jsx';
import TaskFilter from './components/TaskFilter.jsx'; 


function App() {
  // State to control overlay visibility
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const docRef = doc(db, 'tasks', 'Yn7xWRHWqZlKgEiWTo0n')

  const getData = async () => {  
    const docSnap = await getDoc(docRef);

    console.log(docSnap.data());
  }

  useEffect(() => {getData()}, [])


  // Function to handle the "Create" button click
  const handleCreateButtonClick = () => {
    setOverlayVisible(true);  // Show the overlay
  };

  // Function to handle closing the overlay
  const handleOverlayClose = () => {
    setOverlayVisible(false);  // Hide the overlay
  };
  const handleFilterChange = (criteria) => { // Step 3: Create handler for filter changes
    setFilterCriteria(criteria);
  };
  // Function to handle saving the task (example logic)
  const handleTaskSave = async (task) => {
    try {
      // Call the createTask function from your task service
      const taskId = await createTask(task);
      console.log('Task created with ID:', taskId);

      // Optionally handle UI updates here (e.g., showing success message or clearing the form)
    } catch (error) {
      console.error('Error saving task:', error);
      // Optionally handle error states in UI
    }

    setOverlayVisible(false);  // Hide the overlay after saving
  };

  const handleDeleteTask = (taskIdToDelete) => {
    backEndDeleteTask(taskIdToDelete);
  }

    // Function to handle task click (for editing)
    const handleTaskClick = (task) => {
      setSelectedTask(task);  // Set the clicked task as the selected task
      setEditOverlayVisible(true);  // Show the Edit Task overlay
    };
  
    // Function to handle closing the Edit Task overlay
    const handleEditOverlayClose = () => {
      setEditOverlayVisible(false);  // Hide the Edit Task overlay
    };
  
    // Function to handle saving the edited task
    const handleTaskEditSave = async (updatedTask) => {
      try {
        // Logic for updating the task (if you have an update function)
        console.log('Task updated:', updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
      }
      setEditOverlayVisible(false);  // Hide the Edit Task overlay after saving
    };

  CollapsibleTable();

  return (
    <div className="app-container">
      <NavigationBar />

      <div className="content">
        <h1 className="title">Product Backlog</h1>
        <div className="button-group">
          {/* Pass the click handler to CreateTaskButton */}
          <CreateTaskButton onClick={handleCreateButtonClick} />
              {/* Task Filter */}
          <TaskFilter onFilterChange={handleFilterChange} /> 
        </div>
        <CollapsibleTable />
        
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
