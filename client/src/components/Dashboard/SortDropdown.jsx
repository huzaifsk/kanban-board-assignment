import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SortDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const handleChange = (e) => {
    const [field, order] = e.target.value.split('-');
    onSortChange(field, order);
  };

  return (
    <div className="sort-box">
      <ArrowUpDown size={18} />
      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={handleChange}
        className="sort-select"
      >
        <option value="position-asc">Position</option>
        <option value="title-asc">Title (A-Z)</option>
        <option value="title-desc">Title (Z-A)</option>
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
        <option value="updatedAt-desc">Recently Updated</option>
      </select>
    </div>
  );
};

export default React.memo(SortDropdown);
