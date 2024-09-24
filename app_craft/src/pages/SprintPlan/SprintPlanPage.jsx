import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from "../../components/NavigationBar"; // Adjust the path as necessary
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './SprintPlanPage.css'; // Ensure this import is correct

/**
 * SprintPlanPage component
 * This component displays the tasks in a sprint and the product backlog for a not started sprint.
 * It allows the user to drag and drop tasks between the sprint and the product backlog.
 */

// Mock data
const initialBacklog = [
    { id: 'task-1', name: 'Task 1', priority: 'High', tags: ['UI', 'Bug'], storypoint: 3 },
    { id: 'task-2', name: 'Task 2', priority: 'Medium', tags: ['Backend'], storypoint: 5 },
    { id: 'task-3', name: 'Task 3', priority: 'Low', tags: ['UI', 'Enhancement'], storypoint: 2 },
];

const initialSprint = {
    name: 'Sprint 1',
    startDate: '2023-10-01',
    endDate: '2023-10-15',
    scrumMaster: 'John Doe',
    tasks: [
        { id: 'task-4', name: 'Task 4', priority: 'High', tags: ['API'], storypoint: 8 },
    ],
};

const SprintPlanPage = () => {

    const location = useLocation();
    // Retrieve the sprint object from location state if available (from table)
    const sprintFromState = location.state?.sprint; // Retrieve the sprint object from location state if available
    console.log('the sprint taken form table', sprintFromState);
    // Check if the sprint object is available
    sprintFromState ? console.log(sprintFromState.name) : console.log("No sprint object found");

    // Still need to get product backlog tasks and filter out the tasks that are already in the sprint (most likely you will need to fetch this from the server)
    // Filtering could be done by checking if status is null, because if it is not null, it means the task is already in a sprint (logic could be chaneged based on your implementation)

    // Currently using mock backlog
    const [backlog, setBacklog] = useState(initialBacklog);
    // Currently still using mock data, but you can replace this with the sprint object from location state
    const [sprint, setSprint] = useState(initialSprint);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) return;

        // Reordering within the same list
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                source.droppableId === 'backlog' ? backlog : sprint.tasks,
                source.index,
                destination.index
            );

            if (source.droppableId === 'backlog') {
                setBacklog(items);
            } else {
                setSprint({ ...sprint, tasks: items });
            }
        } else {
            // Moving between lists
            const result = move(
                source.droppableId === 'backlog' ? backlog : sprint.tasks,
                source.droppableId === 'backlog' ? sprint.tasks : backlog,
                source,
                destination
            );

            setBacklog(result.backlog);
            setSprint({ ...sprint, tasks: result.sprint });
        }
    };

    return (
        <div className="sprintPlanPage-container">
            <NavigationBar />
            <div className="content">
                <Link to="/sprintboard" className="back-button">Back to Sprint Board</Link>
                <h1>{sprint.name}</h1>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="columns">
                        <div className="column">
                            <h2 className="column-header">Sprint Tasks</h2>
                            <Droppable droppableId="sprint">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {sprint.tasks && sprint.tasks.map((task, index) => (
                                            task && (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="task"
                                                        >
                                                            <h3 className='task-name-h3'>{task.name}</h3>
                                                            <p className={`priority-display ${task.priority.toLowerCase()}`}>{task.priority}</p>
                                                            <div className="task-tags">
                                                                {task.tags.map(tag => (
                                                                    <span key={tag} className={`tag-display ${tag.toLowerCase()}`}>{tag}</span>
                                                                ))}
                                                            </div>
                                                            <p className="storypoint-circle">{task.storypoint}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <div className="column">
                            <h2 className="column-header">Product Backlog</h2>
                            <Droppable droppableId="backlog">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {backlog && backlog.map((task, index) => (
                                            task && (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="task"
                                                        >
                                                            <h3>{task.name}</h3>
                                                            <p className={`priority-display ${task.priority.toLowerCase()}`}>{task.priority}</p>
                                                            <div className="task-tags">
                                                                {task.tags.map(tag => (
                                                                    <span key={tag} className={`tag-display ${tag.toLowerCase()}`}>{tag}</span>
                                                                ))}
                                                            </div>
                                                            <p className="storypoint-circle">{task.storypoint}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

// Helper functions to reorder and move tasks
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * Moves an item from one list to another list
 * @param {Array} source - The source list
 * @param {Array} destination - The destination list
 * @param {Object} droppableSource - The source object
 * @param {Object} droppableDestination - The destination object
 * @returns {Object} - The updated lists
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

export default SprintPlanPage;