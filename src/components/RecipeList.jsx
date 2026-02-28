//Caputures the array of recipes and puts it in a grid of RecipeCard parts


  import RecipeCard from './RecipeCard';

  function RecipeList({ recipes, onRecipeClick }) {
    return (
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>
    );
  }

  export default RecipeList;