import React from 'react';
import { BrowserRouter as Router, Route,Routes } from'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import HomePage from '../pages/general/HomePage';
import Profile from '../pages/food-partner/Profile'
import CreateFood from '../pages/food-partner/CreateFood';
import Saved from '../pages/general/Saved';


const AppRoutes = () => {
  return (
  <>
  
  <Router>
    <Routes>
      <Route path="/user/register" element={<UserRegister></UserRegister>} />
      <Route path="/user/login" element={<UserLogin></UserLogin>} />
      <Route path="/food-partner/login" element={<FoodPartnerLogin></FoodPartnerLogin>} />
      <Route path="/food-partner/register" element={<FoodPartnerRegister></FoodPartnerRegister>} />
      <Route path='/' element={<HomePage></HomePage>}></Route>
      <Route path='/create-food' element={<CreateFood></CreateFood>}></Route>
      <Route path='/food-partner/:id' element={<Profile></Profile>}></Route>
      <Route path='/saved' element={<Saved></Saved>}></Route>
    </Routes>
  </Router>
  

  </>
  )
} 

export default AppRoutes;
    