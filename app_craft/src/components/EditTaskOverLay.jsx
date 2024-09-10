import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './EditTaskOverlay.css';
import CancelButton from './CancelButton.jsx';
import SaveButton from './SaveButton.jsx'; // Use SaveButton here
import CrossButton from './CrossButton.jsx';
import Dropdown from './Dropdown.jsx';
import { EditFilesInDB } from './EditFilesInDB.jsx';


function EditTaskOverlay({ task, onClose, onSave }) {
    const [taskName, setTaskName] = useState('');
    const [taskType, setTaskType] = useState('Bug');
    const [taskStage, setTaskStage] = useState('Planning');
    const [storyPoints, setStoryPoints] = useState(1);
    const [priority, setPriority] = useState('Low');
    const [tags, setTags] = useState([]);
    const [assignee, setAssignee] = useState('');
    const [description, setDescription] = useState('');

    const taskTypes = ['Story', 'Bug'];
    const taskStages = ['Planning', 'Development', 'Testing', 'Integration'];
    const priorities = ['Low', 'Medium', 'Important', 'Urgent'];
    const availableTags = ['Frontend', 'Backend', 'API', 'Database', 'Framework', 'Testing', 'UI', 'UX'];

    // Load the existing task data into the form fields when the component mounts
    useEffect(() => {
        if (task) {
            console.log(task)
            setTaskName(task.taskName);
            setTaskType(task.type);
            setTaskStage(task.stage);
            setStoryPoints(task.storyPoints);
            setPriority(task.priority);
            setTags(task.tag || []);
            setAssignee(task.assignee || '');
            setDescription(task.description || '');
        }
    }, [task]);

    const handleTagChange = (event) => {
        const value = event.target.value;
        setTags(prevTags => 
            prevTags.includes(value) ? prevTags.filter(tag => tag !== value) : [...prevTags, value]
        );
    };

    const handleSave = () => {
        const updatedTask = {
            ...task,  // Keep the original task details
            name: taskName,
            type: taskType,
            stage: taskStage,
            storyPoints,
            priority,
            tags,
            assignee,
            description
        };

        console.log(updatedTask)

        console.log(updatedTask.stage)


        EditFilesInDB(updatedTask.databaseID).changeName(updatedTask.name);
        EditFilesInDB(updatedTask.databaseID).changeType(updatedTask.type); 
        EditFilesInDB(updatedTask.databaseID).changeStage(updatedTask.st);
        EditFilesInDB(updatedTask.databaseID).changeStoryPoints(updatedTask.storyPoints);
        EditFilesInDB(updatedTask.databaseID).changePriority(updatedTask.priority);
        EditFilesInDB(updatedTask.databaseID).changeTags(updatedTask.tags);
        EditFilesInDB(updatedTask.databaseID).changeAssignee(updatedTask.assignee);
        EditFilesInDB(updatedTask.databaseID).changeDescription(updatedTask.description);

        // Use EditFilesInDB to update the task in the database

        onSave(updatedTask); // Call the onSave function with the updated task details

        onClose();  // Close the overlay after saving



        



    };

    return (
        <div className="overlay">
            <div className="overlay-content">
                <h2 className="overlay-title">Edit Task</h2>
                <div><CrossButton onClick={onClose} className="cross-button"/></div>

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
                    <Dropdown
                        id="priority"
                        options={priorities.map(priority => ({ value: priority, label: priority }))}
                        selectedOption={priority}
                        onChange={setPriority}
                    />
                </div>

                {/* Tags */}
                <div className="form-group">
                    <label htmlFor="tags" className="task-label">Tags</label>
                    <div className="tags-container">
                        {availableTags.map(tag => (
                            <label key={tag} className="tag-label">
                                <input
                                    type="checkbox"
                                    value={tag}
                                    checked={tags.includes(tag)}
                                    onChange={handleTagChange}
                                />
                                {tag}
                            </label>
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
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditTaskOverlay;