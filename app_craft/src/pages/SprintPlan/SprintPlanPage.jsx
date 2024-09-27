import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from "../../components/NavigationBar"; // Adjust the path as necessary
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import DraggableTask from './Components/DraggableTask'; // Adjust the path as necessary
import './SprintPlanPage.css'; // Ensure this import is correct

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
    const sprintFromState = location.state?.sprint; // Retrieve the sprint object from location state if available

    const [backlog, setBacklog] = useState(initialBacklog);
    const [sprint, setSprint] = useState(sprintFromState || initialSprint); // Use sprintFromState if available, otherwise use initialSprint

    useEffect(() => {
        // Log the sprint object to the console
        console.log('Sprint object passed to SprintPlanPage:', sprint);
    }, [sprint]);

    const db = getFirestore();

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) return;

        let updatedSprintTasks = [...sprint.tasks];
        let updatedBacklog = [...backlog];

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
                updatedSprintTasks = items;
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
            updatedSprintTasks = result.sprint;
            updatedBacklog = result.backlog;
        }

        // Update Firebase
        try {
            const sprintDocRef = doc(db, 'sprints', sprint.id); // Adjust the path as necessary
            await updateDoc(sprintDocRef, {
                tasks: updatedSprintTasks,
            });
        } catch (error) {
            console.error('Error updating sprint tasks in Firebase:', error);
        }
    };

    const handleTaskClick = (task) => {
        // Define the action to be taken when a task is clicked
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
                                            task && (
                                                <DraggableTask key={task.id} task={task} index={index} onClick={handleTaskClick} />
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
                                                <DraggableTask key={task.id} task={task} index={index} onClick={handleTaskClick} />
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