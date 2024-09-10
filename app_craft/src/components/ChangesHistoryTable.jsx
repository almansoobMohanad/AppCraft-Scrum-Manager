import * as React from 'react';
import ChangesHistoryRow from './ChangesHistoryRow';

const ChangesHistoryTable = () => {
  const changes = [
    { name: 'Change 1', date: '2023-10-01' },
    { name: 'Change 2', date: '2023-10-02' },
    // Add more changes as needed
  ];

  return (
    <div>
      {changes.map((change, index) => (
        <ChangesHistoryRow key={index} name={change.name} date={change.date} />
      ))}
    </div>
  );
};

export default ChangesHistoryTable;