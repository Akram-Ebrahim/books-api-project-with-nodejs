const express = require('express');
require('dotenv').config();
const router = express.Router();
const { 
  registerUser,
  loginUser,
} = require('../controllers/authController');

// /api/auth/register
router.post('/register', registerUser)
// /api/auth/login
router.post('/login', loginUser)

module.exports = router;