import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/sprintTable.css'; // Style specific for the table
import DeleteSprintButton from './deleteSprintButton';


const SprintTable = ({ sprints, onEditSprint, onDeleteSprint }) => {

  const navigate = useNavigate();

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
              <button
                  className="view-sprint-btn"
                  onClick={() => navigate('/sprintbacklog/', { state: { sprintName: sprint.name, sprintTask: sprint.tasks } })}  // Pass sprint name
                >
                  View Sprint
                </button>
                <button className="edit-sprint-btn" onClick={() => onEditSprint(sprint)}>
                  Edit Sprint
                </button>

                <button className="delete-sprint-btn" onClick={() => onDeleteSprint(sprint.id)} >
                <i className="fas fa-trash-alt"></i>
                </button>

                <button
                  className="temp-view-sprint-plan-btn"
                  onClick={() => navigate('/sprintplan/', { state: { sprint } })}  // Navigate to SprintPlanPage with sprint object
                >
                  Temp sprint plan
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
