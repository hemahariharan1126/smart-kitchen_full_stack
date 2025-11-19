const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  ingredients: { type: Array }, 
  sourceUrl: { type: String },
  note: { type: String } 
});

module.exports = mongoose.model('Recipe', recipeSchema);