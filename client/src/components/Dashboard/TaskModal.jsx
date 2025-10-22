import React from 'react';
import { X, Save, Plus, Edit2, Clock, Loader2 } from 'lucide-react';

const TaskModal = ({ 
  isOpen, 
  mode, // 'create' or 'edit'
  task, 
  onClose, 
  onSubmit, 
  onChange,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Task' : 'Create New Task';
  const submitText = isEditMode ? 'Update Task' : 'Create Task';
  const Icon = isEditMode ? Edit2 : Plus;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {isEditMode ? (
            <div className="modal-title-with-badge">
              <h2><Icon size={24} /> {title}</h2>
              <span className="edit-badge">Editing</span>
            </div>
          ) : (
            <h2><Icon size={24} /> {title}</h2>
          )}
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={task.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Enter task title..."
              required
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={task.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Add more details..."
              rows="4"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select
              value={task.status || 'To Do'}
              onChange={(e) => onChange('status', e.target.value)}
              disabled={isLoading}
            >
              <option value="To Do">📋 To Do</option>
              <option value="In Progress">⏳ In Progress</option>
              <option value="Done">✅ Done</option>
            </select>
          </div>
          
          {/* Audit Log - Only show in edit mode */}
          {isEditMode && task.auditLog && task.auditLog.length > 0 && (
            <div className="audit-log-modal">
              <div className="audit-log-header">
                <Clock size={14} />
                <span>Recent Activity (Last 3)</span>
              </div>
              <div className="audit-log-entries">
                {task.auditLog
                  .slice(-3)
                  .reverse()
                  .map((log, index) => (
                    <div key={index} className="audit-entry">
                      <div className="audit-main">
                        <span className="audit-action">
                          {log.action === 'create' && '✨ Created'}
                          {log.action === 'edit' && '✏️ Updated'}
                          {log.action === 'delete' && '🗑️ Deleted'}
                        </span>
                        {log.details?.status && (
                          <span className="audit-details">
                            {log.details.status.old} → {log.details.status.new}
                          </span>
                        )}
                      </div>
                      <span className="audit-time">
                        {new Date(log.performedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              <X size={18} />
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {submitText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(TaskModal);
