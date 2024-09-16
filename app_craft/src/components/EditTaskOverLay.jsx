import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './EditTaskOverlay.css';
import CancelButton from './CancelButton.jsx';
import SaveButton from './SaveButton.jsx';
import CrossButton from './CrossButton.jsx';
import Dropdown from './Dropdown.jsx';
import { EditFilesInDB } from './EditFilesInDB.jsx';
import ChangesHistoryTable from './ChangesHistoryTable.jsx';

/*
const mockTask = {
    databaseID: 'hjxHrhQcXO2Ray9cskR9',
    taskName: 'Implement Login Feature',
    type: 'Bug',
    stage: 'Development',
    storyPoints: 5,
    priority: 'High',
    tags: ['API', 'Backend'],
    assignee: 'John Doe',
    description: 'Implement the login feature using React and Redux.',
    history: [
        { date: '2023-10-01', name: 'Task created' },
        { date: '2023-10-02', name: 'Initial setup completed' },
        { date: '2024-12-02', name: 'Bob'}
    ],
};
*/

function EditTaskOverlay({ task, onClose, onSave }) {

    // console.log('this ism me', task)
    const [taskName, setTaskName] = useState('');
    const [taskType, setTaskType] = useState('Bug');
    const [taskStage, setTaskStage] = useState('Planning');
    const [storyPoints, setStoryPoints] = useState(1);
    const [priority, setPriority] = useState('Low');
    const [tags, setTags] = useState([]);
    const [assignee, setAssignee] = useState('');
    const [description, setDescription] = useState('');
    const [history, setHistory] = useState([]);

    const taskTypes = ['Story', 'Bug'];
    const taskStages = ['Planning', 'Development', 'Testing', 'Integration'];
    const priorities = ['Low', 'Medium', 'Important', 'Urgent'];
    const availableTags = ['Frontend', 'Backend', 'API', 'Database', 'Framework', 'Testing', 'UI', 'UX'];

    // Load the existing task data into the form fields when the component mounts
    useEffect(() => {
        if (task) {
            setTaskName(task.taskName);
            setTaskType(task.type);
            setTaskStage(task.stage);
            setStoryPoints(task.storyPoints);
            setPriority(task.priority);
            setTags(task.tags || []);
            setAssignee(task.assignee || '');
            setDescription(task.description || '');
            setHistory(task.history || []); // Set existing history
        }
    }, [task]);

    const handleTagChange = (event) => {
        const value = event.target.value;
        setTags(prevTags => 
            prevTags.includes(value) ? prevTags.filter(tag => tag !== value) : [...prevTags, value]
        );
    };

    const validateFields = () => {
        if (!taskName || tags.length === 0 || !description) {
            alert('Fields cannot be left empty');
            return false;
        }
        return true;
    };



    const generateHistoryEntry = (name) => {
        return {
            date: new Date().toLocaleDateString('en-GB'),
            name: name,
        };
    };

    const handleSave = () => {

        if (validateFields()){

        console.log('handleSave called');

        const newHistoryEntry = generateHistoryEntry('name');
        console.log('new history entry', newHistoryEntry)

        let newHistoryList = [...task.history, newHistoryEntry]

        console.log('the new history list supposedly', newHistoryList)

    
        const updatedTask = {
            ...task,  // Keep the original task details
            taskName,
            type: taskType,
            stage: taskStage,
            storyPoints,
            priority,
            tags,
            assignee,
            description,
            history: newHistoryList// Update history
        };
    
        console.log('Updated task:', updatedTask);
    
        // Update the task in the database (example)
        const db = EditFilesInDB(updatedTask.databaseID);
        db.changeName(updatedTask.taskName);
        db.changeType(updatedTask.type);
        db.changeStage(updatedTask.stage);
        db.changeStoryPoints(updatedTask.storyPoints);
        db.changePriority(updatedTask.priority);
        db.changeTags(updatedTask.tags);
        db.changeAssignee(updatedTask.assignee);
        db.changeDescription(updatedTask.description);
        db.changeHistory(updatedTask.history)
    
        // Trigger the onSave callback with the updated task
        console.log('onSave called with:', updatedTask);
        onSave(updatedTask);
    
        // Update the history in the component state
        //setHistory(updatedHistory); // <-- Ensure this is updated
    
        // Close the overlay after saving
        onClose();
    }
    };

    return (
        <div className="overlay">
            <div className="overlay-content">
                <h2 className="overlay-title">Edit Task</h2>
                <div><CrossButton onClick={onClose} className="cross-button" /></div>

                {/* Task Name */}
                <div className="form-group">
                    <label htmlFor="task-name" className="task-label">Task Name</label>
                    <input
                        type="text"
                        id="task-name"
                        className="task-input"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                </div>

                {/* Task Type */}
                <div className="form-group">
                    <label htmlFor="task-type" className="task-label">Task Type</label>
                    <Dropdown
                        id="task-type"
                        options={taskTypes.map(type => ({ value: type, label: type }))}
                        selectedOption={taskType}
                        onChange={setTaskType}
                    />
                </div>

                {/* Task Stage */}
                <div className="form-group">
                    <label htmlFor="task-stage" className="task-label">Task Stage</label>
                    <Dropdown
                        id="task-stage"
                        options={taskStages.map(stage => ({ value: stage, label: stage }))}
                        selectedOption={taskStage}
                        onChange={setTaskStage}
                    />
                </div>

                {/* Story Points */}
                <div className="form-group">
                    <label htmlFor="story-points" className="task-label">Story Points</label>
                    <input
                        type="number"
                        id="story-points"
                        min="1"
                        max="10"
                        value={storyPoints}
                        onChange={(e) => setStoryPoints(Number(e.target.value))}
                        className="task-input"
                    />
                </div>

                {/* Priority */}
                <div className="form-group">
                    <label htmlFor="priority" className="task-label">Priority</label>
                    <div className="priority-container">
                        {['Low', 'Medium', 'Important', 'Urgent'].map(priorityLevel => (
                            <div key={priorityLevel} className="priority-checkbox-wrapper">
                                <input
                                    type="radio"  // Use radio buttons since only one priority can be selected
                                    name="priority"
                                    value={priorityLevel}
                                    checked={priority === priorityLevel}
                                    onChange={() => setPriority(priorityLevel)}
                                    className={`priority-checkbox ${priorityLevel.toLowerCase()}`}
                                />
                                <label className={`priority-label ${priorityLevel.toLowerCase()}`}>
                                    {priorityLevel}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Tags */}
                <div className="form-group">
                    <label htmlFor="tags" className="task-label">Tags</label>
                    <div className="tags-container">
                        {availableTags.map(tag => (
                            <div key={tag} className="tag-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    value={tag}
                                    checked={tags.includes(tag)}
                                    onChange={handleTagChange}
                                    className={`tag-checkbox ${tag.toLowerCase()}`}
                                />
                                <label className={`tag-label ${tag.toLowerCase()}`}>
                                    {tag}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assignee */}
                <div className="form-group">
                    <label htmlFor="assignee" className="task-label">Assignee</label>
                    <input
                        type="text"
                        id="assignee"
                        className="task-input"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description" className="task-label">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="task-textarea"
                    />
                </div>

                {/* Change History Table */}
                <div className="change-history-section">
                    <h3>Changes History</h3>
                    <ChangesHistoryTable changes={history} />
                </div>

                {/* Save and Cancel */}
                <div className="overlay-actions">
                    <CancelButton onClick={onClose} className="cancel-button" />
                    <SaveButton onClick={handleSave} className="save-button" />
                </div>
            </div>
        </div>
    );
}

EditTaskOverlay.propTypes = {
    task: PropTypes.shape({
        taskName: PropTypes.string,
        type: PropTypes.string,
        stage: PropTypes.string,
        storyPoints: PropTypes.number,
        priority: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        assignee: PropTypes.string,
        description: PropTypes.string,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                date: PropTypes.string,
            }))
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditTaskOverlay
