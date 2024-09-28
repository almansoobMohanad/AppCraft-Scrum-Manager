import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from "../../components/NavigationBar"; // Adjust the path as necessary
import localDB from '../../LocalDatabase'; // Adjust the path as necessary
import TaskBoard from './Components/TaskBoard';
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
            const filteredTasks = tasks.filter(task => task.status === null); // Filter backlog tasks
            setBacklog(filteredTasks);
        } catch (error) {
            console.error('Error fetching product backlog tasks:', error);
        }
    };

    useEffect(() => {
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
    }, []); // Empty dependency array means this effect runs once when the component mounts

    useEffect(() => {
        console.log('Backlog', backlog);
    }, [backlog]); // This effect runs whenever the backlog state changes

        return (
            <div className="sprintPlanPage-container">
                <NavigationBar />
                <div className="content">
                    <Link to="/sprintboard" className="back-button">Back to Sprint Board</Link>
                    <h1>{sprint.name}</h1>
                    {console.log('Backlog passed to TaskBoard:', backlog)}
                    {console.log('Sprint tasks passed to TaskBoard:', sprint.tasks)}
                    <TaskBoard
                        backlog={backlog}
                        sprintTasks={sprint.tasks}
                        setBacklog={setBacklog}
                        setSprint={setSprint}
                    />
                </div>
            </div>
        );
    };

export default SprintPlanPage;
