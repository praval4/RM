const foodModel = require('../models/food.model');
const stotageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');
const likeModel = require('../models/like.model');
const saveModel = require('../models/save.model');

async function createFood(req,res){

   const uploadFileResult = await stotageService.uploadFile(req.file.buffer,uuid());

   const foodItem=await foodModel.create({
    name:req.body.name,
    description:req.body.description,
    video:uploadFileResult.url,
    foodPartner:req.foodPartner._id
   });
  
   res.status(201).json({message:"Food Itwm created successfully",foodItem,
    foodPartnerId:req.foodPartner._id
   });
   

}

async function getFoodItems(req,res){
  const foodItems=await foodModel.find({})
  if(!foodItems){
    return res.status(404).json({message:"No food items found"});
  }
  res.status(200).json({message:"food items fetched successfully",
  foodItems
});
}

async function likeFood(req,res){
 const {foodId}=req.body;
 const user = req.user;

 const isAlreadyLiked = await likeModel.findOne({
  user:user._id,
  food:foodId
 })


 await foodModel.findByIdAndUpdate(foodId,{
  $inc:{likeCount:1}
 })
  if(isAlreadyLiked){
    return res.status(400).json({message:"User already liked this food"})
  }
  const like = await likeModel.create({
    user:user._id,
    food:foodId
  });
  await foodModel.findByIdAndUpdate(foodId,{
    $inc:{likeCount:1}
  }
    )
      res.status(201).json({message:"Food liked successfully",like});

}

// Toggle save - create or remove save record, update food.savesCount
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!foodId) return res.status(400).json({ message: 'foodId required' });

    const existing = await saveModel.findOne({ user: user._id, food: foodId });
    
    if (existing) {
      await saveModel.deleteOne({ _id: existing._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
      return res.json({ message: 'Unsaved', save: false });
    } else {
      // save
      await saveModel.create({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });
      return res.status(201).json({ message: 'Saved', save: true });
    }
  } catch (err) {
    console.error('saveFood error', err);
    return res.status(500).json({ message: 'Failed to toggle save' });
  }
}

// Return saved foods for the authenticated user
async function getSavedFoods(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const saved = await saveModel
      .find({ user: user._id })
      .populate({
        path: 'food',
        select: 'video description likeCount savesCount commentsCount foodPartner'
      })
      .lean();

    const savedFoods = saved.map(s => ({ food: s.food }));

    return res.json({ savedFoods });
  } catch (err) {
    console.error('getSavedFoods error', err);
    return res.status(500).json({ message: 'Failed to fetch saved foods' });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFoods
}