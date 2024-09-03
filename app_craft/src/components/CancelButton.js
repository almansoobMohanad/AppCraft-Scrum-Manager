import * as React from 'react';

const App = () => {
    const handleClick = () => {
        alert('Cancel button clicked');
    };
  return (
    <div>
      <button type="button">Cancel</button>
    </div>
  );
};

export default App;