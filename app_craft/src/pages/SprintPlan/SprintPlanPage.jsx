import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from "../../components/NavigationBar"; // Adjust the path as necessary
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableTask from './Components/DraggableTask'; // Adjust the path as necessary
import localDB from '../../LocalDatabase'; // Adjust the path as necessary
import './SprintPlanPage.css'; // Ensure this import is correct

const SprintPlanPage = () => {
    const location = useLocation();
    const sprintFromState = location.state?.sprint; // Retrieve the sprint object from location state if available

    const [backlog, setBacklog] = useState([]); // Initialize an empty backlog
    const [sprint, setSprint] = useState(sprintFromState || { name: '', tasks: [] }); // Initialize sprint

    // Fetch product backlog tasks from localDB
    const fetchBacklogTasks = async () => {
        try {
            await localDB.init(); // Initialize localDB and fetch the data
            const tasks = localDB.getData(); // Get the tasks from the localDB
            setBacklog(tasks.filter(task => task.status === null)); // Filter backlog tasks
        } catch (error) {
            console.error('Error fetching product backlog tasks:', error);
        }
    };

    useEffect(() => {
        console.log('Sprint object passed to SprintPlanPage:', sprint);

        // Fetch backlog tasks on component mount
        fetchBacklogTasks();
    }, [sprint]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        let updatedSprintTasks = [...sprint.tasks];
        let updatedBacklog = [...backlog];

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
                updatedSprintTasks = items;
            }
        } else {
            const result = move(
                source.droppableId === 'backlog' ? backlog : sprint.tasks,
                source.droppableId === 'backlog' ? sprint.tasks : backlog,
                source,
                destination
            );

            setBacklog(result.backlog);
            setSprint({ ...sprint, tasks: result.sprint });
            updatedSprintTasks = result.sprint;
            updatedBacklog = result.backlog;

            // Check if moving from Sprint Backlog to Product Backlog
            if (source.droppableId === 'sprint' && destination.droppableId === 'backlog') {
                // Remove the task from the sprint array in the frontend state
                const newSprintTasks = updatedSprintTasks.filter(task => task.id !== draggableId);
                setSprint({ ...sprint, tasks: newSprintTasks });

                // Add the task to the product backlog array in the frontend state
                const task = sprint.tasks.find(task => task.id === draggableId);
                setBacklog([...backlog, task]);

                // update the task in the database
                try {
                    await removeTaskFromSprintBacklog(draggableId, sprint.id);
                } catch (error) {
                    console.error('Error removing task from sprint backlog:', error);
                }
            }
        }

        

        // Add or update the tasks in the localDB
        updatedSprintTasks.forEach((task) => {
            localDB.editData(task.databaseID, task); // Update in the localDB
        });

        updatedBacklog.forEach((task) => {
            localDB.editData(task.databaseID, task);
        });
    };

    const handleTaskClick = (task) => {
        console.log('Task clicked:', task);
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
                                            <DraggableTask key={task.id} task={task} index={index} onClick={handleTaskClick} />
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
                                            <DraggableTask key={task.id} task={task} index={index} onClick={handleTaskClick} />
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
