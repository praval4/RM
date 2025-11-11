const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');

async function registerUser(req, res) {

    const { fullname, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      fullname,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname
      }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );
    res.cookie("token", token);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname
      }
    });
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: 'User logged out successfully' });
}

async function registerFoodPartner(req,res){
  const {name,email,password,phone,address,contactName}=req.body;
  
  const isAccountAlreadyExists = await foodPartnerModel.findOne({email});
  if(isAccountAlreadyExists){
    return res.status(400).json({message:'Account already exists'});
  }
  const hashedPassword = await bcrypt.hash(password,10);

  const foodPartner = new foodPartnerModel({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    contactName
});

 await foodPartner.save();

 const token=jwt.sign({
  id:foodPartner._id
 },process.env.JWT_SECRET);

 res.cookie("token",token,{httpOnly:true});

 res.status(201).json({
  message:'Food Partner registered successfully',
  foodPartner:{
    id:foodPartner._id,
    email:foodPartner.email,
    name:foodPartner.name
  }
 })
}

async function loginFoodPartner(req,res){
  const {email,password}=req.body;
  const foodPartner = await foodPartnerModel.findOne({email});

  if(!foodPartner){
    return res.status(400).json({message:'Invalid email or password'});
  }

  const isPasswordValid = await bcrypt.compare(password,foodPartner.password);

  if(!isPasswordValid){
    return res.status(400).json({message:"Invalid email or password"});
  }

  const token=jwt.sign({
    id:foodPartner._id
  },process.env.JWT_SECRET);

  res.cookie("token",token);
  
   res.status(200).json({
    message:"partner logged in successfully",
    foodPartner:{
      _id:foodPartner._id,
      email:foodPartner.email,
      name:foodPartner.name
    }
  }
)
}

async function logoutFoodPartner(req,res){
  res.clearCookie("token");
  return res.status(200).json({messgae:"food partner logged out successfully"});
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
};
