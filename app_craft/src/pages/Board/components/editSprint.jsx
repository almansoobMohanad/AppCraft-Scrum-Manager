import React, { useState, useEffect } from 'react';
import '../css/editSprint.css';

const EditSprint = ({ sprintDetails, onEdit, onClose }) => {
    const [sprintName, setSprintName] = useState(sprintDetails.name || '');
    const [startDate, setStartDate] = useState(sprintDetails.startDate || '');
    const [endDate, setEndDate] = useState(sprintDetails.endDate || '');
    const [productOwner, setProductOwner] = useState(sprintDetails.productOwner || '');
    const [scrumMaster, setScrumMaster] = useState(sprintDetails.scrumMaster || '');
    const [members, setMembers] = useState(sprintDetails.members ? sprintDetails.members.join(', ') : '');
    const [error, setError] = useState('');

    const handleEditSprint = () => {
        const today = new Date().setHours(0, 0, 0, 0); // Get today's date without time

        if (!sprintName.trim() || !startDate || !endDate || !productOwner.trim() || !members.trim()) {
            setError('All fields are required.');
            return;
        }

        if (new Date(startDate) < today || new Date(endDate) < today) {
            setError('Dates cannot be before today.');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError('End date cannot be earlier than start date.');
            return;
        }

        onEdit({
            name: sprintName,
            startDate,
            endDate,
            productOwner,
            scrumMaster,
            members: members.split(',').map((member) => member.trim()),
        });
        onClose(); // Close overlay after editing the sprint
    };

    return (
        <div className="edit-sprint-overlay">
            <div className="overlay">
                <div className="overlay-content">
                    <h2 className="overlay-title">Edit Sprint</h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label>Sprint Name</label>
                        <input
                            type="text"
                            value={sprintName}
                            onChange={(e) => setSprintName(e.target.value)}
                            placeholder="Enter Sprint Name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Owner</label>
                        <input
                            type="text"
                            value={productOwner}
                            onChange={(e) => setProductOwner(e.target.value)}
                            placeholder="Enter Product Owner"
                        />
                    </div>
                    <div className="form-group">
                        <label>Scrum Master</label>
                        <input
                            type="text"
                            value={scrumMaster}
                            onChange={(e) => setScrumMaster(e.target.value)}
                            placeholder="Enter Scrum Master"
                        />
                    </div>
                    <div className="form-group">
                        <label>Members</label>
                        <input
                            type="text"
                            value={members}
                            onChange={(e) => setMembers(e.target.value)}
                            placeholder="Enter Members (comma separated)"
                        />
                    </div>
                    <div className="button-group">
                        <button className="cancel-button" onClick={onClose}>Cancel</button>
                        <button className="edit-button" onClick={handleEditSprint}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSprint;
