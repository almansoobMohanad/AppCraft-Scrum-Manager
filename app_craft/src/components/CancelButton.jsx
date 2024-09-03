import * as React from 'react';

const CancelButton = () => {
    const handleClick = () => {
        alert('Cancel button clicked');
    };
  return (
    <div>
      <button type="button" onClick={handleClick}>
        Cancel </button>
    </div>
  );
}

export default CancelButton;