import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/sprintTable.css'; // Style specific for the table
import DeleteSprintButton from './deleteSprintButton';


const SprintTable = ({ sprints, onEditSprint, onDeleteSprint }) => {

  const navigate = useNavigate();

  const handleViewSprint = (sprint) => {

    console.log('the handle status issue', sprint)

    if (sprint.status === 'Not Active') {
        navigate('/sprintplan/', { state: { sprint } });
    } else if (sprint.status === 'Active' || sprint.status === 'Finished') {
        navigate('/sprintbacklog/', { state: { sprintName: sprint.name, sprintTask: sprint.tasks } });
    }
};



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
                  onClick={() => handleViewSprint(sprint) }  // Pass sprint name
                >
                  View Sprint
                </button>
                
                {sprint.status === 'Not Active' && (
                  <button className="start-sprint-btn" onClick={() => onStartSprint(sprint)}>
                    Start Sprint
                  </button>
                )}

                {sprint.status !== 'Finished' && (
                  <button className="edit-sprint-btn" onClick={() => onEditSprint(sprint)}>
                    Edit Sprint
                  </button>
                )}

                <button className="delete-sprint-btn" onClick={() => onDeleteSprint(sprint.id)} >
                <i className="fas fa-trash-alt"></i>
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
