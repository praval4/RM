
const express = require('express');
const router = express.Router();
const foodPartnerController = require('../controllers/food-partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');


const authAnyMiddleware = async (req, res, next) => {
  await authMiddleware.authUserMiddleware(req, res, (userErr) => {
    if (!userErr && req.user) return next(); 

    
    authMiddleware.authFoodPartnerMiddleware(req, res, (partnerErr) => {
      if (!partnerErr && req.foodPartner) return next(); 

      
      return res.status(401).json({ message: 'Unauthorized' });
    });
  });
};


router.get('/:id', authAnyMiddleware, foodPartnerController.getFoodPartnerById);

module.exports = router;
