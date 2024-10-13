import React, { useState, useEffect } from 'react';
import { removeMemberFromActiveSprint } from '../components/sprintDatabaseLogic.jsx'; // Import backend logic to remove member
import '../css/viewMembers.css';

const ViewMembers = ({ sprintDetails, members, onRemoveMember }) => {
    return (
        <div className="view-members">
            <h3>Members in Sprint</h3>
            <ul>
                {members.map(member => (
                    <li key={member.id}>
                        <span>{member.email}</span>
                        <button 
                            className={sprintDetails.status === 'active' ? "" : "disabled"} 
                            onClick={() => onRemoveMember(member.id)}
                            disabled={sprintDetails.status !== 'active'}
                        >
                            Remove Member
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewMembers;
