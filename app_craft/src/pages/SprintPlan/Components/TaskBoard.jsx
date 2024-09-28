import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DragTask from './DragTask';
import EditTaskOverlay from '../../../components/EditTaskOverLay';
import '../css/TaskBoard.css';
import { addTaskToSprintBacklog } from '../SprintBacklogAdd';
import { removeTaskFromSprintBacklog } from '../SprintBacklogRemove';


const TaskBoard = ({ backlog, sprintTasks, setBacklog, setSprint, sprintID }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If there's no destination, do nothing
        if (!destination) return;

        // If the source and destination are the same, do nothing
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        console.log('source id', source.droppableId,  'destination id', destination.droppableId);

        let updatedBacklog = Array.from(backlog);
        let updatedSprintTasks = Array.from(sprintTasks);

        console.log('sprint we are in rn id', sprintID);

        // Moving from backlog to sprint tasks
        if (source.droppableId === 'backlog' && destination.droppableId === 'sprintTasks') {
            const [movedTask] = updatedBacklog.splice(source.index, 1);
            updatedSprintTasks.splice(destination.index, 0, movedTask);

            console.log(movedTask.id);

            // Add the task to the sprint backlog
            addTaskToSprintBacklog(movedTask.id, sprintID); // Replace 'sprintID' with the actual sprint ID

        }

        // Moving from sprint tasks to backlog
        if (source.droppableId === 'sprintTasks' && destination.droppableId === 'backlog') {
            const [movedTask] = updatedSprintTasks.splice(source.index, 1);
            updatedBacklog.splice(destination.index, 0, movedTask);
            
            removeTaskFromSprintBacklog(movedTask.id,sprintID);
        }

        setBacklog(updatedBacklog);
        setSprint(prevSprint => ({ ...prevSprint, tasks: updatedSprintTasks }));
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedTask(null);
    };

    const handleUpdate = (updatedTask) => {
        const updateTasks = (tasks) => tasks.map(task => {
            if (!task || !task.id) return task; // If task is undefined or has no databaseID, return it as is
            return task.id === updatedTask.id ? updatedTask : task;
        });

        const updatedBacklog = updateTasks(backlog);
        const updatedSprintTasks = updateTasks(sprintTasks);

        setBacklog(updatedBacklog);
        setSprint(prevSprint => ({ ...prevSprint, tasks: updatedSprintTasks }));

        closeOverlay();
    };



    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="task-board">
                    <Droppable droppableId="sprintTasks">
                        {(provided) => (
                            <div className="sprint-tasks" ref={provided.innerRef} {...provided.droppableProps}>
                                <h2 className='board-title'>Sprint Tasks</h2>
                                {sprintTasks.map((task, index) => (
                                    <DragTask key={task.id} task={task} index={index} onClick={handleTaskClick} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="backlog">
                        {(provided) => (
                            <div className="backlog" ref={provided.innerRef} {...provided.droppableProps}>
                                <h2 className='board-title'>Backlog</h2>
                                {backlog.map((task, index) => (
                                    <DragTask key={task.id} task={task} index={index} onClick={handleTaskClick} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
            {isOverlayVisible && selectedTask && (
                <EditTaskOverlay
                    task={selectedTask}
                    onClose={closeOverlay}
                    onSave={handleUpdate}
                />
            )}
        </>
    );
};

export default TaskBoard;