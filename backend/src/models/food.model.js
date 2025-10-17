const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  video: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodPartner'
  },
  likeCount:{
    type: Number,
    default: 0
  }
});

// Safe model creation: check if model already exists
const FoodModel = mongoose.models.Food || mongoose.model('Food', foodSchema);

module.exports = FoodModel;
