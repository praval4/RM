const express = require('express');
const router = express.Router();
const foodPartnerController = require('../controllers/food-partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/user/:id', authMiddleware.authUserMiddleware, foodPartnerController.getFoodPartnerByIdForUser);
router.get('/partner/:id', authMiddleware.authFoodPartnerMiddleware, foodPartnerController.getFoodPartnerByIdForPartner);

module.exports = router;
