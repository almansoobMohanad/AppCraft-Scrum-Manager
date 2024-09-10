// utils/sortUtils.js

// Function to dynamically sort data by a given key in ascending ('asc') or descending ('desc') order
const dynamicSort = (key, order = 'asc') => {
    return function (a, b) {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;  // Ascending order
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;  // Descending order
      return 0; // If both are equal
    };
  };
  
  // Function to sort data based on criteria
  export function sortData(data, criteria) {
    switch (criteria) {
      case 'UrgentToLow':
        // Sorting by priority from most urgent to low
        return data.sort(dynamicSort('priority', 'desc'));
      case 'LowToUrgent':
        // Sorting by priority from low to most urgent
        return data.sort(dynamicSort('priority', 'asc'));
      case 'Oldest':
        // Sorting by date from oldest to newest
        return data.sort(dynamicSort('date', 'asc'));
      case 'Recent':
        // Sorting by date from most recent to oldest
        return data.sort(dynamicSort('date', 'desc'));
      default:
        // If no criteria is matched, return data as is
        return data;
    }
  }
  