import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Base URL for the live Render API
const API_BASE_URL = 'https://smart-kitchen-full-stack.onrender.com/api';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState(''); 
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('search'); 

  
  const fetchRecipes = async () => {
    try {
      // Calls the LIVE Render API
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
      // Calls the LIVE Render API
      await axios.post(`${API_BASE_URL}/favorites`, {
        title: recipe.title,
        image: recipe.image,
        ingredients: recipe.extendedIngredients, 
        note: userNote
      });
      alert("Saved! 😋");
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  
  const fetchFavorites = async () => {
    try {
      // Calls the LIVE Render API
      const response = await axios.get(`${API_BASE_URL}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  
  const deleteRecipe = async (id) => {
    try {
      // Calls the LIVE Render API
      await axios.delete(`${API_BASE_URL}/favorites/${id}`);
      setFavorites(favorites.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const switchToFavorites = () => {
    fetchFavorites();
    setView('favorites');
  };

  return (
    <div className="App">
      <h1>👨‍🍳 Smart Kitchen 👩‍🍳</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <button className="nav-btn" onClick={() => setView('search')}>🔍 Search</button>
        <button className="nav-btn" onClick={switchToFavorites}>📖 My Cookbook</button>
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

          <button className="search-btn" onClick={fetchRecipes}>Find Recipes</button>
        </div>
      )}

      <div className="recipe-grid">
        {view === 'search' ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
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

              <button className="save-btn" onClick={() => saveRecipe(recipe)}>❤️ Save</button>
            </div>
          ))
        ) : (
          favorites.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              {recipe.note && <p className="note-text">"{recipe.note}"</p>}
              <button className="delete-btn" onClick={() => deleteRecipe(recipe._id)}>🗑️ Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;