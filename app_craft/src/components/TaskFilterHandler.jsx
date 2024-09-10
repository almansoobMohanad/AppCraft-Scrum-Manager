import React, { useState } from 'react';
import TaskFilter from './TaskFilter';  // Adjust the import path
import TaskCardDetail from './TaskCardDetail';  // Changed from 'CollapsibleTable' to 'TaskCardDetail'

export default function TaskManager() {
  const [filters, setFilters] = useState({
    tags: [],         // Filter for tags (empty array means no filter)
    priority: '',     // Filter for priority (empty string means no filter)
    storyPoints: null // Filter for story points (null means no filter)
  });

  // Function to update filters based on TaskFilter component's changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      {/* TaskFilter component, where the user sets their filters */}
      <TaskFilter onFilterChange={handleFilterChange} />
      
      {/* TaskCardDetail component with the applied filters */}
      <TaskCardDetail filters={filters} />
    </div>
  );
}
