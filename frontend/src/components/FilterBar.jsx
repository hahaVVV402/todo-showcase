const FilterBar = ({ activeCount, currentFilter, onFilterChange }) => {
  return (
    <div className="stats">
      <span>{activeCount} task{activeCount !== 1 ? 's' : ''} left</span>
      <div className="filters">
        <button 
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
