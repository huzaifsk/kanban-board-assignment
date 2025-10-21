import React from 'react';
import { Plus } from 'lucide-react';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import FilterButtons from './FilterButtons';
import HelpNote from './HelpNote';

const DashboardHeader = ({
  searchTerm,
  onSearchChange,
  onSearchClear,
  sortBy,
  sortOrder,
  onSortChange,
  filterStatus,
  onFilterChange,
  onAddTask
}) => {
  return (
    <div className="dashboard-header">
      <div className="header-left-section">
        <div className="search-filter-controls">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onClear={onSearchClear}
          />
          <SortDropdown 
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
          <FilterButtons 
            filterStatus={filterStatus}
            onFilterChange={onFilterChange}
          />
        </div>
        <HelpNote />
      </div>

      <button className="add-task-btn" onClick={onAddTask}>
        <Plus size={20} />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default React.memo(DashboardHeader);
