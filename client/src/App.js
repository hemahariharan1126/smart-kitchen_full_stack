import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Base URL for the live Render API (Ensure this matches your live URL)
const API_BASE_URL = 'https://smart-kitchen-full-stack.onrender.com/api';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState(''); 
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('search'); 

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`, { 
        params: { ingredients, cuisine }
      });
      console.log("Server Response:", response.data); 
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      alert("Something went wrong. Check server terminal.");
    }
  };

  const saveRecipe = async (recipe) => {
    const userNote = prompt("Add a note? (e.g. 'Spicy!')");
    try {
      await axios.post(`${API_BASE_URL}/favorites`, {
        title: recipe.title,
        image: recipe.image,
        ingredients: recipe.extendedIngredients, 
        note: userNote
      });
      alert("Recipe saved successfully! 😋");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save recipe.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/favorites/${id}`);
      setFavorites(favorites.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete recipe.");
    }
  };

  const switchToFavorites = () => {
    fetchFavorites();
    setView('favorites');
  };

  return (
    <div className="App">
      <h1>👨‍🍳 Smart Kitchen 👩‍🍳</h1>
      
      {/* Navigation Buttons using nav-btn class */}
      <div style={{ marginBottom: '30px' }}>
        <button className="nav-btn" onClick={() => setView('search')}>
          🔍 Search
        </button>
        <button className="nav-btn" onClick={switchToFavorites}>
          📖 My Cookbook
        </button>
      </div>

      {view === 'search' && (
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Enter ingredients (e.g. chicken, rice)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="cuisine-select">
            <option value="">Any Cuisine</option>
            <option value="Indian">Indian 🇮🇳</option>
            <option value="Italian">Italian 🇮🇹</option>
            <option value="Mexican">Mexican 🇲🇽</option>
            <option value="Chinese">Chinese 🇨🇳</option>
          </select>

          {/* Search button using search-btn class */}
          <button className="search-btn" onClick={fetchRecipes}>Find Recipes</button>
        </div>
      )}

      <div className="recipe-grid">
        {view === 'search' ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card"> {/* Card Class Applied */}
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              
              <details style={{margin: '10px 0', textAlign: 'left', color: '#555'}}>
                <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>📝 View Instructions</summary>
                <ol style={{paddingLeft: '20px', marginTop: '10px'}}>
                  {recipe.analyzedInstructions?.[0]?.steps.map((step) => (
                    <li key={step.number} style={{marginBottom: '5px'}}>{step.step}</li>
                  )) || <p>No instructions available.</p>}
                </ol>
              </details>

              {/* Save button using save-btn class */}
              <button className="save-btn" onClick={() => saveRecipe(recipe)}>
                ❤️ Save Recipe
              </button>
            </div>
          ))
        ) : (
          favorites.map((recipe) => (
            <div key={recipe._id} className="recipe-card"> {/* Card Class Applied */}
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              
              {/* Note display using note-text class */}
              {recipe.note && <p className="note-text">"{recipe.note}"</p>}
              
              {/* Delete button using delete-btn class */}
              <button className="delete-btn" onClick={() => deleteRecipe(recipe._id)}>
                🗑️ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;