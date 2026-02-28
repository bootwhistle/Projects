  //Shows one cahrd and photo with name, clicking on italics
  //calls the 'onClick' function with meal id so can load details
  
  function RecipeCard({ recipe, onClick }) {
    return (
      <div className="recipe-card" onClick={() => onClick(recipe.idMeal)}>
        <img
          src={recipe.strMealThumb} //thumbnail source
          alt={recipe.strMeal}
          className="recipe-img"
        />
        <div className="recipe-info">
          <h3 className="recipe-name">{recipe.strMeal}</h3>
          <p className="recipe-meta">Click to view full recipe</p>
        </div>
      </div>
    );
  }

  //allows use by other components
  export default RecipeCard;