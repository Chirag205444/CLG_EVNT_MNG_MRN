const express = require('express');
const router=express.Router();
const {registerUser,loginUser,logoutUser,updateProfile,deleteAccount}=require('../controlers/auth.controler');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteAccount);

module.exports=router;
