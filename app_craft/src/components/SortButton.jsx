import React, { useState } from 'react';
import './SortButton.css';

const SortButton = ({ onSort }) => {
  const [isSortOpen, setIsSortOpen] = useState(false); // State to manage sort button dropdown
  const [isPriorityOpen, setIsPriorityOpen] = useState(false); // State to manage priority dropdown

  const handleSortButtonClick = () => {
    setIsSortOpen(!isSortOpen); // Toggle sort button dropdown visibility
    setIsPriorityOpen(false); // Close priority dropdown if open
  };

  const handlePriorityButtonClick = () => {
    setIsPriorityOpen(!isPriorityOpen); // Toggle priority dropdown visibility
  };

  const handleSortOptionClick = (sortType) => {
    onSort(sortType); // Call the onSort function with the selected sort type
    setIsSortOpen(false); // Close dropdowns after selection
    setIsPriorityOpen(false);
  };

  return (
    <div className="sort-button-container">
      {/* Sort Button */}
      <button className="sort-button" onClick={handleSortButtonClick}>
        Sort
      </button>
      {isSortOpen && (
        <div className="sort-options">
          {/* Priority Button */}
          <button className="priority-button" onClick={handlePriorityButtonClick}>
            Priority
          </button>
          {isPriorityOpen && (
            <div className="priority-options">
              {/* Priority Sorting Options */}
              <button onClick={() => handleSortOptionClick('UrgentToLow')}>
                Most Urgent to Low
              </button>
              <button onClick={() => handleSortOptionClick('LowToUrgent')}>
                Low to Most Urgent
              </button>
            </div>
          )}
          {/* Other sorting options */}
          <button onClick={() => handleSortOptionClick('Oldest')}>Oldest</button>
          <button onClick={() => handleSortOptionClick('Recent')}>Recent</button>
        </div>
      )}
    </div>
  );
};

export default SortButton;
