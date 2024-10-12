import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../cssFiles/EditTaskOverlay.css';
import CancelButton from './CancelButton.jsx';
import SaveButton from './SaveButton.jsx';
import CrossButton from './CrossButton.jsx';
import Dropdown from './Dropdown.jsx';
import { EditFilesInDB } from './EditFilesInDB.jsx';
import ChangesHistoryTable from './ChangesHistoryTable.jsx';
import localDB from '../LocalDatabase.jsx';
import { updateTask } from '../services/tasksService.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chart.js/auto';
import MemberDropdown from '../pages/Board/components/memberDropdown';
import { fetchUsers } from '../pages/Board/components/sprintDatabaseLogic';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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

function EditTaskOverlay({ task, onClose, onSave, onUpdate, showAssignee }) {
    console.log('Props received:', { task, onClose, onSave, onUpdate });

    console.log('showAssignee value:', showAssignee);

    const [name, setTaskName] = useState('');
    const [taskType, setTaskType] = useState('Bug');
    const [taskStage, setTaskStage] = useState('Planning');
    const [storyPoints, setStoryPoints] = useState(1);
    const [priority, setPriority] = useState('Low');
    const [tags, setTags] = useState([]);
    const [assignee, setAssignee] = useState('');
    const [description, setDescription] = useState('');
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState('Not Started');
    const [logTimeSpent, setLogTimeSpent] = useState(0);
    const [totalLogTime, setTotalLogTime] = useState(0); // To display total logged time
    const [logTimeHistory, setLogTimeHistory] = useState([]); // New state for log time by date
    const [sprintId, setSprintId] = useState(null);
    const [members, setMembers] = useState([]); 
    const [memberOptions, setMemberOptions] = useState([]);


    const taskTypes = ['Story', 'Bug'];
    const taskStages = ['Planning', 'Development', 'Testing', 'Integration'];
    const priorities = ['Low', 'Medium', 'Important', 'Urgent'];
    const availableTags = ['Frontend', 'Backend', 'API', 'Database', 'Framework', 'Testing', 'UI', 'UX'];

    const chartData = {
        labels: logTimeHistory.map(entry => entry.date), // X-axis labels (dates)
        datasets: [
            {
                label: 'Log Time Spent (hours)',
                data: logTimeHistory.map(entry => entry.logTime), // Y-axis data (log times)
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1, // Smooth line
            },
        ],
    };
    
    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                min: 0, // Set the minimum value for the y-axis
                max: totalLogTime? totalLogTime + 10: 10, // Set the maximum value for the y-axis
                title: {
                    display: true,
                    text: 'Log Time (hours)',
                },
                beginAtZero: true,
            },
        },
    };
    

    // Load the existing task data into the form fields when the component mounts
    useEffect(() => {
        if (task) {
            setTaskName(task.name);
            setTaskType(task.type);
            setTaskStage(task.stage);
            setStoryPoints(task.storyPoints);
            setPriority(task.priority);
            setTags(task.tags || []);
            setAssignee(task.assignee || '');
            setDescription(task.description || '');
            setHistory(task.history || []); // Set existing history
            setStatus(task.status);
            //setLogTimeSpent(task.logtimeSpent); // Set initial log time
            setTotalLogTime(task.logtimeSpent || 0); // Set initial total log time
            setLogTimeHistory(task.logTimeHistory || []); // Set existing log time history
            setSprintId(task.sprintId || null); // Set the sprint ID
            console.log('Total log time from task:', task.logtimeSpent); // Debug log
            

        }
    }, [task]);

        // Fetch users from Firestore and populate member options
        useEffect(() => {
            const loadUsers = async () => {
                try {
                    const users = await fetchUsers();
                    const options = users.map(user => ({ label: user.username, value: user.username }));
                    setMemberOptions(options);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
            
            loadUsers();
        }, []);

        const handleMemberSelect = (option) => {
            setAssignee(option.value);
        };
        

    const handleTagChange = (event) => {
        const value = event.target.value;
        setTags(prevTags => 
            prevTags.includes(value) ? prevTags.filter(tag => tag !== value) : [...prevTags, value]
        );
    };

    const handleAddTime = () => {
        if (!logTimeSpent || logTimeSpent <= 0) return; // Skip if invalid input
    
        const currentDate = new Date().toLocaleDateString('en-GB'); // Use today's date
        
        const updatedTotalLogTime = totalLogTime + Number(logTimeSpent);
        setTotalLogTime(updatedTotalLogTime); // Update the total log time
    
        // Update the log time history with the new log
        const updatedLogTimeHistory = [...logTimeHistory];
        
        // Check if an entry for the current date already exists
        const existingEntry = updatedLogTimeHistory.find(entry => entry.date === currentDate);
        
        if (existingEntry) {
            // If there's already an entry for today, update the log time
            existingEntry.logTime += Number(logTimeSpent);
        } else {
            // If there's no entry for today, create a new one
            updatedLogTimeHistory.push({ date: currentDate, logTime: Number(logTimeSpent) });
        }
        
        setLogTimeHistory(updatedLogTimeHistory); // Update state with new history
        setLogTimeSpent(0); // Reset the input after adding time
    
        console.log(`New Total Log Time: ${updatedTotalLogTime} hours`);
    };
    

    const validateFields = () => {
        if (!name || tags.length === 0 || !description) {
            alert('Fields cannot be left empty');
            return false;
        }
        return true;
    };

    const generateHistoryEntry = (name) => {
        return {
            date: new Date().toLocaleDateString('en-GB'),
            name: assignee,
        };
    };

    const handleSave = (updateHandler) => {

        if (validateFields()){

        console.log('handleSave called');

        const newHistoryEntry = generateHistoryEntry('name');
        console.log('new history entry', newHistoryEntry)

        let newHistoryList = [...task.history, newHistoryEntry]

        console.log('the new history list supposedly', newHistoryList)

        onUpdate();

        const updatedTask = {
            ...task,  // Keep the original task details
            name,
            type: taskType,
            stage: taskStage,
            storyPoints,
            priority,
            sprintId,
            tags,
            assignee,
            description,
            history: newHistoryList,    // Update history
            status,
            logtimeSpent: totalLogTime, // Update the logged time
            logTimeHistory: logTimeHistory,


        };
    
        console.log('Updated task:', updatedTask);
    
        // Update the task in the database (example)
        const db = EditFilesInDB(updatedTask.id);
        db.changeName(updatedTask.name);
        db.changeType(updatedTask.type);
        db.changeStage(updatedTask.stage);
        db.changeStoryPoints(updatedTask.storyPoints);
        db.changePriority(updatedTask.priority);
        db.changeTags(updatedTask.tags);
        db.changeAssignee(updatedTask.assignee);
        db.changeDescription(updatedTask.description);
        db.changeHistory(updatedTask.history)
        db.changeStatus(updatedTask.status);
        db.changeLogtimeSpent(updatedTask.logtimeSpent);
        db.changeLogTimeHistory(updatedTask.logTimeHistory);
    

        localDB.editData(updatedTask.id, updatedTask);

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
                        value={name}
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

                {/* Conditionally render the Assignee dropdown */}
                {showAssignee && (
                    <div className="form-group">
                        <label htmlFor="assignee" className="task-label">Assignee</label>
                        <MemberDropdown
                            inputValue={{ label: assignee, value: assignee }}
                            options={memberOptions}
                            handleSelect={handleMemberSelect}
                            isMulti={false}
                        />
                    </div>
                )}

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

                {task.status && (
                    <>
                        {/* New Activity Section */}
                        <div className="activity-section">
                            <h3>Activity</h3>
                            <div className="log-info">
                                <p>Total Log Time: <span>{totalLogTime} Hours</span></p>
                            </div>
                                <div className="log-input-container">
                                    <label>Log Time Spent</label>
                                    <div className="log-input-wrapper">
                                        <input
                                            type="number"
                                            value={logTimeSpent}
                                            onChange={(e) => setLogTimeSpent(e.target.value)}
                                            className="log-input"
                                        />
                                        <button className="add-time-button" onClick={handleAddTime}>+</button> {/* Place the button after the input */}
                                        <span className="log-input-label">hour(s)</span>
                                    </div>
                                </div>
                        </div>

                        {/* Chart Section */}
                        <div className="chart-section">
                            <h3>Log Time History</h3>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </>
                )}

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
        name: PropTypes.string,
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
    handleUpdate: PropTypes.func.isRequired,
    showAssignee: PropTypes.bool,
};



export default EditTaskOverlay
