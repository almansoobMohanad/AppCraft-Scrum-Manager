import { useState, useEffect } from 'react';
import CancelButton from './components/CancelButton.jsx';
import CreateTaskButton from './components/CreateTaskButton.jsx';
import AddTaskOverlay from './components/AddTaskOverlay.jsx';  // Import the overlay component
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import CrossButton from './components/CrossButton.jsx';
import Home from './pages/home.jsx';
import {doc, getDoc} from 'firebase/firestore';
import {db} from './firebaseConfig';


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
  const handleTaskSave = (task) => {
    console.log('Task saved:', task);  // Perform save logic here
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
