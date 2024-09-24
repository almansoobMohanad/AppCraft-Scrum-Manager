import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import './SprintBacklogPage.css';
import NavigationBar from "../../components/NavigationBar";
import { Link } from "react-router-dom";

const initialData = {
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

function SprintBacklogPage() {
    const location = useLocation();
    const sprintName = location.state?.sprintName || "Current Sprint";

    const [state, setState] = useState(initialData);
    const [view, setView] = useState('kanban'); // Add state to track view mode (kanban or list)

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = state.columns[source.droppableId];
        const finish = state.columns[destination.droppableId];

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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="kanban-board">
                            {state.columnOrder.map((columnId) => {
                                const column = state.columns[columnId];
                                const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

                                return <Column key={column.id} column={column} tasks={tasks} />;
                            })}
                        </div>
                    </DragDropContext>
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
                                        <div className="task-name">{task.content}</div>  {/* Task name bubble */}
                                        <div className="task-field story-points">{task.storyPoints}</div>
                                        <div className={`task-field priority-${task.priority.toLowerCase()}`}>{task.priority}</div>
                                        <div className={`task-field tags-${task.tags.toLowerCase()}`}>
                                            {task.tags}
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
                    <th>Task</th>
                    <th>Tags</th>
                    <th>Priority</th>
                    <th>Story Points</th>
                    <th>Status</th> {/* New Status column */}
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
                            <td>{task.content}</td>
                            <td>{task.tags}</td>
                            <td>{task.priority}</td>
                            <td>{task.storyPoints}</td>
                            <td>{status}</td> {/* Display status */}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}


export default SprintBacklogPage;
