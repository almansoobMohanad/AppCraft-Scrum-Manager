import React, { useState } from 'react';
import '../css/createSprint.css'; // Ensure you import the CSS file

const CreateSprint = ({ onCreate, onClose }) => {
    const [sprintName, setSprintName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [productOwner, setProductOwner] = useState('');
    const [scrumMaster, setScrumMaster] = useState(''); // New state for Scrum Master
    const [members, setMembers] = useState('');
    const [error, setError] = useState('');

    const handleCreateSprint = () => {
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

        onCreate({
            name: sprintName,
            startDate,
            endDate,
            productOwner,
            scrumMaster, // Include Scrum Master in the created sprint
            members: members.split(',').map((member) => member.trim()), // Convert members into an array
        });
        onClose(); // Close overlay after creating the sprint
    };

    return (
        <div className="create-sprint-overlay">
            <div className="overlay">
                <div className="overlay-content">
                    <h2 className="overlay-title">Create Sprint</h2>
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
                        <button className="create-button" onClick={handleCreateSprint}>Create Sprint</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSprint;