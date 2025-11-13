const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerByIdForUser(req, res) {
  try {
    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

    if (!foodPartner) {
      return res.status(404).json({ message: 'Food partner not found' });
    }

    res.status(200).json({
      message: 'Food partner fetched successfully (user)',
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner
      }
    });
  } catch (err) {
    console.error('Error in getFoodPartnerByIdForUser:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getFoodPartnerByIdForPartner(req, res) {
  try {
    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

    if (!foodPartner) {
      return res.status(404).json({ message: 'Food partner not found' });
    }

    res.status(200).json({
      message: 'Food partner fetched successfully (partner)',
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner
      }
    });
  } catch (err) {
    console.error('Error in getFoodPartnerByIdForPartner:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { 
  getFoodPartnerByIdForUser, 
  getFoodPartnerByIdForPartner 
};
