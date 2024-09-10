import React, { useState, useEffect } from 'react';
import TaskFilter from './TaskFilter';  // Adjust the import path
import TaskCardDetail from './TaskCardDetail';  // Changed from 'CollapsibleTable' to 'TaskCardDetail'
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Adjust the import path

export default function TaskFilterHandler() {
  const [filters, setFilters] = useState({
    tags: [],         // Filter for tags (empty array means no filter)
    priority: '',     // Filter for priority (empty string means no filter)
    storyPoints: null // Filter for story points (null means no filter)
  });

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const fetchedTasks = [];
    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        ...doc.data()
      };
      fetchedTasks.push(data);
    });
    setTasks(fetchedTasks);
  };

  // Function to update filters based on TaskFilter component's changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Function to apply filters to the fetched data
  const applyFilters = () => {
    let filtered = tasks;

    if (filters.tags.length > 0) {
      filtered = filtered.filter(task => filters.tags.includes(task.tags));
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.storyPoints !== null) {
      filtered = filtered.filter(task => task.storyPoints === filters.storyPoints);
    }

    setFilteredTasks(filtered);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters whenever the filters or tasks change
  useEffect(() => {
    applyFilters();
  }, [filters, tasks]);

  return (
    <div>
      {/* TaskFilter component, where the user sets their filters */}
      <TaskFilter onFilterChange={handleFilterChange} />
      
      {/* TaskCardDetail component with the applied filters */}
      {filteredTasks.map(task => (
        <TaskCardDetail key={task.id} row={task} />
      ))}
    </div>
  );
}