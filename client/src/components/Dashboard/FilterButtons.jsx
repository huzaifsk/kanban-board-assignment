import React from 'react';
import { Filter } from 'lucide-react';

const FILTER_OPTIONS = ['All', 'To Do', 'In Progress', 'Done'];

const FilterButtons = ({ filterStatus, onFilterChange }) => {
  return (
    <div className="filter-box">
      <Filter size={18} />
      <div className="filter-buttons">
        {FILTER_OPTIONS.map((option) => {
          const value = option === 'All' ? '' : option;
          return (
            <button
              key={option}
              className={`filter-btn ${filterStatus === value ? 'active' : ''}`}
              onClick={() => onFilterChange(value)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(FilterButtons);
