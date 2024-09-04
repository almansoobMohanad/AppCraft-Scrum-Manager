import * as React from 'react';

const CrossButton = ({ onClick, className }) => {
  return (
    <div>
      <button type="button" onClick={onClick} className = {className} style={{ fontSize: '20px', border: 'none', background: 'none', cursor: 'pointer' }}>
        &times;
      </button>
    </div>
  );
};

export default CrossButton;