import { toast } from 'sonner';
import { API_ENDPOINTS } from '../config/api';

export const useDragAndDrop = (setTasks, draggedTask, setDraggedTask) => {
  const handleDragStart = (e, task) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';
    const isCreator = task.createdBy?._id === user.id;

    if (!isAdmin && !isCreator) {
      e.preventDefault();
      toast.error("You can only drag your own tasks or if you are an admin.");
      return;
    }

    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => e.target.classList.add('hide'), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    if (draggedTask) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDragEnd = (e) => {
    e.target.classList.remove('hide');
    setDraggedTask(null);
  };
  
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedTask) return;
    
    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return; 
    }

    const token = localStorage.getItem('token');
    const oldStatus = draggedTask.status;
    const taskToMove = { ...draggedTask, status: newStatus };
    
    // Optimistic update
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      newTasks[oldStatus] = newTasks[oldStatus].filter(t => t._id !== draggedTask._id);
      newTasks[newStatus] = [...newTasks[newStatus], taskToMove];
      return newTasks;
    });
    
    try {
      const response = await fetch(API_ENDPOINTS.TASK_BY_ID(draggedTask._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const error = await response.json();
        // Revert on error
        setTasks(prevTasks => {
          const newTasks = { ...prevTasks };
          newTasks[newStatus] = newTasks[newStatus].filter(t => t._id !== draggedTask._id);
          newTasks[oldStatus] = [...newTasks[oldStatus], draggedTask];
          return newTasks;
        });
        throw new Error(error.msg || 'Failed to move task');
      }
      
      toast.success(`Task moved to ${newStatus}!`);
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error(error.message);
    } finally {
      setDraggedTask(null);
    }
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    handleDrop
  };
};
