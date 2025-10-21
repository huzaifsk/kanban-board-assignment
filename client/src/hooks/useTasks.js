import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../config/api';

export const useTasks = (searchTerm, filterStatus, sortBy, sortOrder) => {
  const [tasks, setTasks] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': []
  });
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('status', filterStatus);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('order', sortOrder);
      
      const url = `${API_ENDPOINTS.TASKS}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const grouped = {
        'To Do': [],
        'In Progress': [],
        'Done': []
      };
      
      data.forEach(task => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });
      
      setTasks(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setLoading(false);
    }
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, fetchTasks, setTasks };
};
