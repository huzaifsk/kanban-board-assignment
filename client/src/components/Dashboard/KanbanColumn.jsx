import React from 'react';
import { ClipboardList, Clock, CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMN_ICONS = {
  'To Do': ClipboardList,
  'In Progress': Clock,
  'Done': CheckCircle2
};

const KanbanColumn = ({ 
  status, 
  tasks, 
  draggedTaskId,
  user,
  onDragOver, 
  onDragEnter, 
  onDragLeave, 
  onDrop,
  onTaskDragStart,
  onTaskDragEnd,
  onTaskEdit,
  onTaskDelete
}) => {
  const IconComponent = COLUMN_ICONS[status];
  const isAdmin = user.role === 'admin';

  return (
    <div className="kanban-column">
      <div className="column-header">
        <div className="column-header-content">
          <IconComponent size={20} />
          <h3>{status}</h3>
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div 
        className="column-content" 
        data-status={status}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, status)}
      >
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet</p>
        ) : (
          tasks.map((task) => {
            const isCreator = task.createdBy?._id === user.id;
            const isEditable = isAdmin || isCreator;
            const isDragging = draggedTaskId === task._id;
            
            return (
              <TaskCard
                key={task._id}
                task={task}
                isEditable={isEditable}
                isDragging={isDragging}
                onDragStart={(e) => onTaskDragStart(e, task)}
                onDragEnd={onTaskDragEnd}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default React.memo(KanbanColumn);
