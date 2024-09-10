import React, { useState } from 'react';
import './TaskFilter.css';

const TaskFilter = ({ onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStoryPoint, setSelectedStoryPoint] = useState(null);

  const tags = ['Frontend', 'Backend', 'API', 'Database']; // Example tags
  const priorities = ['Low', 'Medium', 'Important', 'Urgent']; // Example priorities

  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    onFilterChange({ tags: updatedTags, priority: selectedPriority, storyPoints: selectedStoryPoint });
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
    onFilterChange({ tags: selectedTags, priority, storyPoints: selectedStoryPoint });
  };

  const handleStoryPointChange = (point) => {
    setSelectedStoryPoint(point);
    onFilterChange({ tags: selectedTags, priority: selectedPriority, storyPoints: point });
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <span>Tags:</span>
        {tags.map((tag, i) => (
          <button
            key={i}
            className={`filter-button ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => handleTagChange(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="filter-section">
        <span>Priority:</span>
        {priorities.map((priority, i) => (
          <button
            key={i}
            className={`filter-button ${selectedPriority === priority ? 'active' : ''}`}
            onClick={() => handlePriorityChange(priority)}
          >
            {priority}
          </button>
        ))}
      </div>
      <div className="filter-section">
        <span>Story Points:</span>
        {[...Array(10)].map((_, i) => (
          <button
            key={i + 1}
            className={`story-point-button color-${i + 1} ${selectedStoryPoint === i + 1 ? 'active' : ''}`}
            onClick={() => handleStoryPointChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;
