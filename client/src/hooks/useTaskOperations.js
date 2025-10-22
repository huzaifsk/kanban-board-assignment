import { useState } from 'react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../config/api';

export const useTaskOperations = (fetchTasks) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleCreateTask = async (taskData) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create task');
      }
      
      toast.success('Task created successfully!');
      fetchTasks(); 
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message);
      return false;
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_ENDPOINTS.TASK_BY_ID(taskId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to update task');
      }
      
      toast.success('Task updated successfully!');
      fetchTasks(); 
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.message);
      return false;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return false;
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_ENDPOINTS.TASK_BY_ID(taskId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to delete task');
      }
      
      toast.success('Task deleted successfully!');
      fetchTasks(); 
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.message);
      return false;
    }
  };

  return {
    draggedTask,
    setDraggedTask,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask
  };
};
