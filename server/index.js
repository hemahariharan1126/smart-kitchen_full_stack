require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const Recipe = require('./models/Recipe');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const MONGO_URI = 'mongodb+srv://myAtlasDBUser:gMdzbTBys1TUXP2r@cluster0.qt1aheh.mongodb.net/?appName=Cluster0'

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ Connection Error:', err));



app.get('/', (req, res) => {
  res.send('Hello from the Smart Kitchen Server!');
});


app.get('/api/recipes', async (req, res) => {
  try {
    const ingredients = req.query.ingredients; 
    const cuisine = req.query.cuisine; 
    const apiKey = process.env.SPOONACULAR_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "API Key missing in .env" });
    }

    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients are required" });
    }

    console.log(`🔎 Searching: ${ingredients} | Cuisine: ${cuisine || 'Any'}`);

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          includeIngredients: ingredients,
          cuisine: cuisine, 
          instructionsRequired: true, 
          addRecipeInformation: true, 
          number: 3,
          apiKey: apiKey
        }
      }
    );

    res.json(response.data.results);
    
  } catch (error) {
    console.error("❌ Spoonacular API Error:", error.message);
    res.status(500).send("Error fetching recipes");
  }
});


app.post('/api/favorites', async (req, res) => {
  try {
    const { title, image, ingredients, sourceUrl, note } = req.body;

    if (!title) return res.status(400).json({ error: "Title required" });

    const newRecipe = new Recipe({ title, image, ingredients, sourceUrl, note });
    await newRecipe.save(); 
    res.status(201).json(newRecipe);

  } catch (error) {
    console.error("Error saving:", error);
    res.status(500).json({ error: "Failed to save" });
  }
});


app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await Recipe.find(); 
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});


app.delete('/api/favorites/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});