
//Communicates with TheMealDB API, has three functions, 

//the free api provided for project, note: more features on paid 
//version can use for making another app, maybe good to filter for calorie/diabetic diets?
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';  


  // Search for meals by a single ingredient, multi pick is paid
  export async function searchByIngredient(ingredient) {
    const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await res.json();
    return data.meals || [];
  }

  // Get full details for one meal by its ID
  export async function getMealById(id) {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
  }

  // Browse meals by dietary category (Vegetarian, Vegan, etc.)
  export async function filterByCategory(category) {
    const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await res.json();
    return data.meals || [];
  }