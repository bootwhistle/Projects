//A row of filters clickable buttons for types of recipes, 
//for future could add diabetic, keto etc

  const FILTERS = ['All', 'Vegetarian', 'Vegan', 'Seafood', 'Chicken', 'Beef', 'Dessert'];

  function FilterBar({ activeFilter, onFilterChange }) {
    return (
      <div className="filter-bar">
        <span className="filter-label">Filter by:</span>
        {FILTERS.map((filter) => (
          <button //created buttons for each filter
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  }

  export default FilterBar;