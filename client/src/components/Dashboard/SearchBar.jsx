import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="search-box">
      <Search size={18} />
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button className="clear-search" onClick={onClear}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default React.memo(SearchBar);
