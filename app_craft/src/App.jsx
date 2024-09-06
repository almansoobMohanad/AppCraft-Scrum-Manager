import { useState, useEffect } from 'react';
import CancelButton from './components/CancelButton.jsx';
import CreateTaskButton from './components/CreateTaskButton.jsx';
import AddTaskOverlay from './components/AddTaskOverlay.jsx';  // Import the overlay component
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import CrossButton from './components/CrossButton.jsx';
import Home from './pages/home.jsx';
import {doc, getDoc} from 'firebase/firestore';
import {db} from './firebase/firebaseConfig.js';
import { createTask } from "./services/tasksService"; //import task service

function App() {
  // State to control overlay visibility
  const [isOverlayVisible, setOverlayVisible] = useState(false);

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

  return (
    <div className="app-container">
      <NavigationBar />
      
      <div className="content">
      <Home /> {/* Add the Home component here */}
        <h1 className="title">Product Backlog</h1>
        <div className="button-group">
          <CrossButton />
          {/* Pass the click handler to CreateTaskButton */}
          <CreateTaskButton onClick={handleCreateButtonClick} />
          <CancelButton />
        </div>
        
      </div>

      {/* Conditionally render the AddTaskOverlay */}
      {isOverlayVisible && (
        <AddTaskOverlay onClose={handleOverlayClose} onSave={handleTaskSave} />
      )}
    </div>
  );
}

export default App;
