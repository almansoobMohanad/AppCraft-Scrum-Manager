import { useState, useEffect } from 'react';
import CreateTaskButton from './components/CreateTaskButton.jsx';
import AddTaskOverlay from './components/AddTaskOverlay.jsx';  // Import the overlay component
import EditTaskOverlay from './components/EditTaskOverLay.jsx';
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig.js';
import { createTask } from "./services/tasksService"; 
import CollapsibleTable from './components/TaskCardDetail.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import SortButton from './components/SortButton.jsx';
import { sortData } from './utils/sortUtils'; // Import the sortData function

function App() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]); // State to manage list of tasks
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'tasks', 'Yn7xWRHWqZlKgEiWTo0n');
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
    };

    fetchData();
  }, []);

  const handleCreateButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleOverlayClose = () => {
    setOverlayVisible(false);
  };

  const handleTaskSave = async (task) => {
    try {
      const taskId = await createTask(task);
      console.log('Task created with ID:', taskId);
      setTasks([...tasks, task]);  // Add the new task to the list
    } catch (error) {
      console.error('Error saving task:', error);
    }

    setOverlayVisible(false); 
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
  const handleSortTasks = (sortType) => {
    let sortedTasks;
    if (sortType === 'UrgentToLow') {
      sortedTasks = sortData(tasks, 'priority', 'desc');
    } else if (sortType === 'LowToUrgent') {
      sortedTasks = sortData(tasks, 'priority', 'asc');
    } else if (sortType === 'Oldest') {
      sortedTasks = sortData(tasks, 'date', 'asc');
    } else if (sortType === 'Recent') {
      sortedTasks = sortData(tasks, 'date', 'desc');
    }
    setTasks(sortedTasks);
  };

  return (
    <div className="app-container">
      <NavigationBar />

      <div className="content">
        <h1 className="title">Product Backlog</h1>
        <div className="button-group">
          <CreateTaskButton onClick={handleCreateButtonClick} />
          <SortButton onSort={handleSortTasks} /> {/* Integrate SortButton */}
          <TaskFilter onFilterChange={() => {}} />
        </div>

        <CollapsibleTable tasks={tasks} />
      </div>

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
