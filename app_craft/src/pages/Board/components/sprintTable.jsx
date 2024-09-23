import React from 'react';
import '../css/sprintTable.css'; // Style specific for the table

const SprintTable = ({ sprints, onEditSprint, onDeleteSprint }) => {
  return (
    <table className="sprint-table">
      <thead>
        <tr>
          <th>Sprint Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sprints.map((sprint) => {
          const status = sprint.status ? sprint.status.toLowerCase().replace(/\s+/g, '-') : 'not-active'; // Ensure default status
          
          return (
            <tr key={sprint.id}>
              <td>{sprint.name}</td>
              <td>
                <span className={`status-text status-${status}`}>
                  {sprint.status || 'Not Active'}
                </span>
              </td>
              <td className="actions-column">
                <button className="view-sprint-btn" onClick={() => console.log(`View Sprint ${sprint.id}`)}>
                  View Sprint
                </button>
                <button className="edit-sprint-btn" onClick={() => onEditSprint(sprint)}>
                  Edit Sprint
                </button>
                <button className="delete-sprint-btn" onClick={() => onDeleteSprint(sprint.id)}>
                  Delete Sprint
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SprintTable;
