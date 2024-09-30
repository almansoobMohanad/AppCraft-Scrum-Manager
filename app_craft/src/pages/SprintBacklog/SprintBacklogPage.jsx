import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import './SprintBacklogPage.css';
import NavigationBar from "../../components/NavigationBar";
import { Link } from "react-router-dom";
import localDB from '../../LocalDatabase';
import { EditFilesInDB } from '../../components/EditFilesInDB';
import { getFirestore, doc, collection, query, where, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Bar } from 'react-chartjs-2'; // Import Chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import chart.js modules


const DummyData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Task 1', storyPoints: '5', priority: 'Important', tags: 'API' },
        'task-2': { id: 'task-2', content: 'Task 2', storyPoints: '8', priority: 'Medium', tags: 'Database' },
        'task-3': { id: 'task-3', content: 'Task 3', storyPoints: '3', priority: 'Low', tags: 'Framework' },
        'task-4': { id: 'task-4', content: 'Task 4', storyPoints: '1', priority: 'Urgent', tags: 'Testing' },
    },
    columns: {
        'not-started': {
            id: 'not-started',
            title: 'Not Started',
            taskIds: ['task-1', 'task-2'],
        },
        'in-progress': {
            id: 'in-progress',
            title: 'In Progress',
            taskIds: ['task-3'],
        },
        'completed': {
            id: 'completed',
            title: 'Completed',
            taskIds: ['task-4'],
        },
    },
    columnOrder: ['not-started', 'in-progress', 'completed'],
};

const KanbanTemplate = {
    tasks: {},
    columns: {
        'not-started': {
            id: 'not-started',
            title: 'Not Started',
            taskIds: [],
        },
        'in-progress': {
            id: 'in-progress',
            title: 'In Progress',
            taskIds: [],
        },
        'completed': {
            id: 'completed',
            title: 'Completed',
            taskIds: [],
        },
    },
    columnOrder: ['not-started', 'in-progress', 'completed'],
};

function SprintBacklogPage() {
    const location = useLocation();
    console.log("SprintBacklogPage location:", location);
    const sprintId = location.state?.sprintId; // Retrieve sprintId from location state
    const sprintName = location.state?.sprintName || "Current Sprint";
    const sprintStatus = location.state?.sprintStatus || "Not Active";
    const sprintTasks = location.state?.sprintTask || [];


    const [state, setState] = useState(KanbanTemplate);
    const [view, setView] = useState('kanban'); // Add state to track view mode (kanban or list)
    console.log("SprintBacklogPage state:", state);


    useEffect(() => {
        // Create a new copy of the Kanban template
        const newData = { ...KanbanTemplate };
    
        // First, clear any existing taskIds in each column to avoid duplication
        newData.columns['not-started'].taskIds = [];
        newData.columns['in-progress'].taskIds = [];
        newData.columns['completed'].taskIds = [];
    
        // Add each task to the appropriate column based on its status
        sprintTasks.forEach((task) => {
            console.log(task.status.replace(' ', '-')); // Check if this matches your column IDs

            newData.tasks[task.id] = task;
            newData.columns[task.status.replace(' ', '-')].taskIds.push(task.id);
        });
    
        // Update the state with the new task data, avoiding duplication
        setState(newData);
    }, [sprintTasks]);
    
    useEffect(() => {
    }, [state]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (sprintStatus === 'Finished') return; // Prevent dragging tasks if sprint is finished
    
        if (!destination) return;
    
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
        const start = state.columns[source.droppableId];
        const finish = state.columns[destination.droppableId];
    
        if (!start || !finish) return; // Ensure start and finish columns are defined
    
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
    
            const newColumn = { ...start, taskIds: newTaskIds };
    
            const newState = { ...state, columns: { ...state.columns, [newColumn.id]: newColumn } };
            setState(newState);
            return;
        }
    
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = { ...start, taskIds: startTaskIds };
    
        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = { ...finish, taskIds: finishTaskIds };
    
        const newState = { ...state, columns: { ...state.columns, [newStart.id]: newStart, [newFinish.id]: newFinish } };
        setState(newState);
    
        // Update the status of the task in the localDB and in the cloud
        const task = state.tasks[draggableId];
        const updatedTask = { ...task, status: finish.id.replace('-', ' ') }; // Ensure status is correctly formatted
        const editDataInCloud = EditFilesInDB(task.id); // Create an instance of the EditFilesInDB class
        localDB.editData(task.id, updatedTask);
        console.log("this is the sprint id", sprintId);
        editDataInCloud.changeStatusSprintTask(task.id, updatedTask.status, sprintId); // Update in cloud database
    };
    

    return (
        <div className="sprintBacklogPage-container">
            <NavigationBar />
            <div className="content">
                <Link to="/sprintboard" className="back-button">Back to Sprint Board</Link>
                <h2 className="sprint-name">{sprintName}</h2>

                {/* Toggle Button for Kanban/List View */}
                <div className="toggle-buttons">
                    <button
                        className={view === 'kanban' ? 'active' : ''}
                        onClick={() => setView('kanban')}
                    >
                        Kanban
                    </button>
                    <button
                        className={view === 'list' ? 'active' : ''}
                        onClick={() => setView('list')}
                    >
                        List
                    </button>
                </div>

                {/* Conditionally render Kanban or List view */}
                {view === 'kanban' ? (
                    <>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="kanban-board">
                            {state.columnOrder.map((columnId) => {
                                const column = state.columns[columnId];
                                const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

                                return <Column key={column.id} column={column} tasks={tasks} />;
                            })}
                        </div>
                    </DragDropContext>
                    {/* Render Burndown Chart if Sprint is Finished */}
                    {sprintStatus === 'Finished' && <BurndownChart tasks={state.tasks} />}
                    </>
                ) : (
                    <ListView tasks={Object.values(state.tasks)} columns={state.columns} />
                )}
            </div>
        </div>
    );
}

function Column({ column, tasks }) {
    return (
        <div className={`column ${column.id}`}>
            <h2>{column.title}</h2>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <div
                                        className={`task ${column.id}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <div className="task-name">{task.name}</div>  {/* Task name bubble */}
                                        <div className="task-field story-points">{task.storyPoints}</div>
                                        <div className={`task-field priority-${task.priority.toLowerCase()}`}>{task.priority}</div>
                                        <div className={`task-field tags-${task.tags.join(', ').toLowerCase()}`}>
                                            {task.tags.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

function ListView({ tasks, columns }) {
    return (
        <table className="list-view-table">
            <thead>
                <tr>
                    <th class = "task-name"> Task </th>
                    <th class="story-points">Story Points</th>
                    <th>Tags</th>
                    <th>Priority</th>
                    <th>Story Points</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => {
                    // Find the status of the task by checking which column it's in
                    let status = '';
                    for (const columnId in columns) {
                        if (columns[columnId].taskIds.includes(task.id)) {
                            status = columns[columnId].title; // Get the column title (status)
                            break;
                        }
                    }

                    return (
                        <tr key={task.id}>
                            <td>{task.name}</td>
                            <td>{status}</td> {/* Display status */}
                            <td>{task.tags}</td>
                            <td>{task.priority}</td>
                            <td>{task.storyPoints}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

// BurndownChart component
function BurndownChart({ tasks }) {
    const totalStoryPoints = Object.values(tasks).reduce((acc, task) => acc + parseInt(task.storyPoints), 0);
    const completedStoryPoints = Object.values(tasks)
        .filter((task) => task.status === 'completed')
        .reduce((acc, task) => acc + parseInt(task.storyPoints), 0);

    const data = {
        labels: ['Total Story Points', 'Completed Story Points'],
        datasets: [
            {
                label: 'Story Points',
                data: [totalStoryPoints, completedStoryPoints],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="burndown-chart-container">
            <h3>Burndown Chart</h3>
            <Bar data={data} options={options} />
        </div>
    );
}


export default SprintBacklogPage;
