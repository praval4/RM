const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactName:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Safe model creation: check if model already exists
const foodPartnerModel = mongoose.models.FoodPartner || mongoose.model('FoodPartner', foodPartnerSchema);

module.exports = foodPartnerModel;
