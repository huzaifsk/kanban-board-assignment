import React from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import UserAvatar from '../UserAvatar';

const TaskCard = ({ 
  task, 
  isEditable, 
  isDragging, 
  onDragStart, 
  onDragEnd, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div 
      className={`task-card ${isDragging ? 'dragging' : ''} ${!isEditable ? 'read-only' : ''}`}
      draggable={isEditable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={() => isEditable && onEdit(task)}
      data-task-id={task._id}
      title={isEditable ? "Double-click to edit" : "Read-only"}
    >
      <div className="task-card-header">
        <div className="drag-handle">
          <GripVertical size={18} className={`grip-icon ${isEditable ? 'draggable' : 'read-only'}`} />
        </div>
        <div className="task-content">
          <h4>{task.title}</h4>
          <div className="task-actions">
            {isEditable && (
              <>
                <button 
                  className="icon-btn edit-btn"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="icon-btn delete-btn"
                  onClick={() => onDelete(task._id)}
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-footer">
        <span className="task-creator">
          <UserAvatar username={task.createdBy?.username} size="small" />
          <span>{task.createdBy?.username || 'Unknown'}</span>
        </span>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);
