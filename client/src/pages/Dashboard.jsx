import React, { useState, useCallback } from 'react';
import { Toaster } from 'sonner';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import KanbanColumn from '../components/Dashboard/KanbanColumn';
import TaskModal from '../components/Dashboard/TaskModal';
import { useTasks } from '../hooks/useTasks';
import { useSocketIO } from '../hooks/useSocketIO';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import './Dashboard.css';

const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];

const Dashboard = () => {
  // Search, Sort, Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('position');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do'
  });

  // Custom hooks
  const { tasks, loading, fetchTasks, setTasks } = useTasks(
    searchTerm, 
    filterStatus, 
    sortBy, 
    sortOrder
  );
  
  useSocketIO(fetchTasks);
  
  const { 
    draggedTask, 
    setDraggedTask,
    handleCreateTask, 
    handleUpdateTask, 
    handleDeleteTask 
  } = useTaskOperations(fetchTasks);
  
  const dragAndDrop = useDragAndDrop(setTasks, draggedTask, setDraggedTask);

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Handlers
  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const handleAddTask = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
    setNewTask({ title: '', description: '', status: 'To Do' });
  }, []);

  const handleNewTaskChange = useCallback((field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCreateTaskSubmit = useCallback(async (e) => {
    e.preventDefault();
    const success = await handleCreateTask(newTask);
    if (success) {
      handleCloseAddModal();
    }
  }, [newTask, handleCreateTask, handleCloseAddModal]);

  const handleEditTask = useCallback((task) => {
    setEditingTask({
      _id: task._id,
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'To Do',
      createdBy: task.createdBy,
      auditLog: task.auditLog || []
    });
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleEditTaskChange = useCallback((field, value) => {
    setEditingTask(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  }, []);

  const handleUpdateTaskSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    
    const success = await handleUpdateTask(editingTask._id, {
      title: editingTask.title,
      description: editingTask.description,
      status: editingTask.status
    });
    
    if (success) {
      handleCloseEditModal();
    }
  }, [editingTask, handleUpdateTask, handleCloseEditModal]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Toaster position="top-right" richColors />
      
      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchClear={() => setSearchTerm('')}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onAddTask={handleAddTask}
      />

      <div className="kanban-board">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks[status]}
            draggedTaskId={draggedTask?._id}
            user={user}
            onDragOver={dragAndDrop.handleDragOver}
            onDragEnter={dragAndDrop.handleDragEnter}
            onDragLeave={dragAndDrop.handleDragLeave}
            onDrop={dragAndDrop.handleDrop}
            onTaskDragStart={dragAndDrop.handleDragStart}
            onTaskDragEnd={dragAndDrop.handleDragEnd}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
          />
        ))}
      </div>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={showAddModal}
        mode="create"
        task={newTask}
        onClose={handleCloseAddModal}
        onSubmit={handleCreateTaskSubmit}
        onChange={handleNewTaskChange}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        mode="edit"
        task={editingTask || {}}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateTaskSubmit}
        onChange={handleEditTaskChange}
      />
    </div>
  );
};

export default Dashboard;
