import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import '../css/draggableTask.css';

const DraggableTask = ({ task, index, onClick }) => {
    return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="task"
                    onClick={() => onClick(task)}
                >
                    <h3 className='task-name-h3'>{task.taskName}</h3>
                    <p className={`priority-display ${task.priority.toLowerCase()}`}>{task.priority}</p>
                    <div className="task-tags">
                        {task.tags.map(tag => (
                            <span key={tag} className={`tag-display ${tag.toLowerCase()}`}>{tag}</span>
                        ))}
                    </div>
                    <p className="storypoint-circle">{task.storyPoints}</p>
                </div>
            )}
        </Draggable>
    );
};

export default DraggableTask;