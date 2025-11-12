const express = require('express');
const router = express.Router();
const foodController=require('../controllers/food.controller');
const authMiddleware=require('../middlewares/auth.middleware');
const multer = require('multer');


const upload = multer({
  storage: multer.memoryStorage(),
});

//protected
router.post('/',
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood);

router.get('/',authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.post('/like',authMiddleware.authUserMiddleware, foodController.likeFood);


router.get('/save', authMiddleware.authUserMiddleware, foodController.getSavedFoods);

router.get('/save', authMiddleware.authFoodPartnerMiddleware, foodController.getSavedFoods);

router.post('/save',authMiddleware.authUserMiddleware, foodController.saveFood);


module.exports = router;