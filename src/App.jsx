  //Controller, process the data and holds it to pass down to other componets to use
  
  import { useState } from 'react';
  import SearchBar from './components/SearchBar';
  import FilterBar from './components/FilterBar';
  import RecipeList from './components/RecipeList';
  import RecipeDetail from './components/RecipeDetail';
  import { searchByIngredient, filterByCategory, getMealById } from './services/api';
  import './App.css';

  function App() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [hasSearched, setHasSearched] = useState(false);

    // Called when user clicks Search
    const handleSearch = async (ingredientsInput) => {
      // Use the first ingredient for the API call
      const firstIngredient = ingredientsInput.split(',')[0].trim();
      setLoading(true);
      setError('');
      setActiveFilter('All');
      try {
        const results = await searchByIngredient(firstIngredient);
        setRecipes(results);
        setHasSearched(true);
        if (results.length === 0) setError('No recipes found. Try different ingredients!');
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Called when user clicks a dietary filter button
    const handleFilterChange = async (filter) => {
      setActiveFilter(filter);
      if (filter === 'All') return;
      setLoading(true);
      setError('');
      try {
        const results = await filterByCategory(filter);
        setRecipes(results);
        setHasSearched(true);
        if (results.length === 0) setError('No recipes found for this filter.');
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Called when user clicks a recipe card
    const handleRecipeClick = async (id) => {
      setLoading(true);
      try {
        const meal = await getMealById(id);
        setSelectedMeal(meal);
      } catch {
        setError('Could not load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="app">
        <header className="app-header">
          <h1>Recipe Search</h1>
          <p>Enter ingredients you have on hand and find recipes!</p>
        </header>
        <main className="app-main">
          <SearchBar onSearch={handleSearch} />
          <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          {loading && <p className="loading">Loading recipes...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && hasSearched && recipes.length > 0 && (
            <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
          )}
          {!hasSearched && !loading && (
            <p className="hint">Search for ingredients above or use a filter to browse recipes!</p>
          )}
        </main>
        {selectedMeal && (
          <RecipeDetail meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
        )}
      </div>
    );
  }

  export default App;
