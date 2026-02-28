  //This creates popup to show the full recipe details and instructions, clicking outside of it closes

  function RecipeDetail({ meal, onClose }) {
    // TheMealDB stores ingredients as strIngredient1, strIngredient2, etc. up to 20
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient}`);
      }
    }

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          <div className="modal-header">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="modal-img" />
            <div className="modal-title">
              <h2>{meal.strMeal}</h2>
              <p><strong>Category:</strong> {meal.strCategory}</p>
              <p><strong>Cuisine:</strong> {meal.strArea}</p>
              {meal.strTags && <p><strong>Tags:</strong> {meal.strTags}</p>}
            </div>
          </div>

          <div className="modal-body">
            <section className="modal-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">
                {ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="modal-section">
              <h3>Instructions</h3>
              <div className="instructions">
                {meal.strInstructions.split('\n').map((para, idx) =>
                  para.trim() ? <p key={idx}>{para}</p> : null
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  export default RecipeDetail;