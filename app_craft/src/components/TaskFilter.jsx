import React, { useState } from 'react';
import './TaskFilter.css';

const TaskFilter = ({ onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagBoxVisible, setIsTagBoxVisible] = useState(false);  // State to toggle tag box visibility
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStoryPoint, setSelectedStoryPoint] = useState(null);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false); // State for Priority dropdown
  const [isStoryPointDropdownOpen, setIsStoryPointDropdownOpen] = useState(false); // State for Story Points dropdown

  // Define tags with their corresponding CSS classes
  const tags = [
    { label: 'Frontend', className: 'frontend' },
    { label: 'Backend', className: 'backend' },
    { label: 'API', className: 'api' },
    { label: 'Database', className: 'database' },
    { label: 'Framework', className: 'framework' },
    { label: 'Testing', className: 'testing' },
    { label: 'UI', className: 'ui' },
    { label: 'UX', className: 'ux' },
  ];

  // Define priority levels and story points
  const priorities = ['Low', 'Medium', 'Important', 'Urgent'];
  const storyPoints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Toggle the visibility of the tag box
  const handleToggleTagBox = () => {
    setIsTagBoxVisible(!isTagBoxVisible);
    setIsPriorityDropdownOpen(false);
    setIsStoryPointDropdownOpen(false);
  };

  // Handle tag selection
  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag) // Remove tag if already selected
      : [...selectedTags, tag]; // Add tag if not selected
    setSelectedTags(updatedTags);
    onFilterChange({ tags: updatedTags, priority: selectedPriority, storyPoints: selectedStoryPoint });
  };

  // Handle priority selection
  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
    onFilterChange({ tags: selectedTags, priority, storyPoints: selectedStoryPoint });
    setIsPriorityDropdownOpen(false); // Close the dropdown after selection
  };

  // Handle story point selection
  const handleStoryPointChange = (storyPoint) => {
    setSelectedStoryPoint(storyPoint);
    onFilterChange({ tags: selectedTags, priority: selectedPriority, storyPoints: storyPoint });
    setIsStoryPointDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="filter-container">
      {/* Tag Selection */}
      <button onClick={handleToggleTagBox} className="filter-button">
        Select Tags
      </button>
      {isTagBoxVisible && (
        <div className="tag-box">
          <div className="filter-section">
            {tags.map((tag, i) => (
              <button
                key={i}
                className={`filter-button ${tag.className} ${selectedTags.includes(tag.label) ? 'active' : ''}`}
                onClick={() => handleTagChange(tag.label)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Priority Filter */}
      <div className="filter-section dropdown">
        <button
          className="filter-button"
          onClick={() => {
            setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
            setIsTagBoxVisible(false);
            setIsStoryPointDropdownOpen(false);
          }}
        >
          {selectedPriority || 'Select Priority'}
        </button>
        {isPriorityDropdownOpen && (
          <div className="priority-dropdown-menu">
            {priorities.map((priority, i) => (
              <button
                key={i}
                className="priority-dropdown-item"
                onClick={() => handlePriorityChange(priority)}
              >
                {priority}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Story Points Filter */}
      <div className="filter-section dropdown">
        <button
          className="Storypoint-button"
          onClick={() => {
            setIsStoryPointDropdownOpen(!isStoryPointDropdownOpen);
            setIsTagBoxVisible(false);
            setIsPriorityDropdownOpen(false);
          }}
        >
          {selectedStoryPoint !== null ? `Story Points: ${selectedStoryPoint}` : 'Select Story Points'}
        </button>
        {isStoryPointDropdownOpen && (
          <div className="story-points-dropdown-menu">
            {storyPoints.map((point, i) => (
              <button
                key={i}
                className="story-points-dropdown-item"
                onClick={() => handleStoryPointChange(point)}
              >
                {point}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;