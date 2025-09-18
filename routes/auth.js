const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const { User, validateRegisterUser, validateLoginUser } = require('../models/User');
const bcrypt = require('bcryptjs'); // Password Hashing

/**
 * @desc Register User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
router.post('/register', async (req,res) => {
  const { error } = validateRegisterUser(req.body)
  if (error) {
    return res.status(400).json({message: error.details[0].message})
  }
  try {
    // check availability
    let user = await User.findOne({email:req.body.email})
    if (user) {
      return res.status(400).json({message: "This user already registered"})
    }

    // password hashing
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);

    // Register New User
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const result = await user.save(); 
    const { password, ...others } = result._doc; // don't send password
    const token = user.generateToken();

    res.status(201).json({ ...others, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Server Error'});
  }
})

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */
router.post('/login', async (req,res) => {
  const { error } = validateLoginUser(req.body)
  if (error) {
    return res.status(400).json({message: error.details[0].message})
  }

  try {
    // check availability
    let user = await User.findOne({email:req.body.email})
    if (!user) {
      return res.status(400).json({message: "Invalid Email Or Password"})
    }

    // compare real password with hash password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({message: "Invalid Email Or Password"})
    }
    const token = user.generateToken();
    const { password , ...other } = user._doc

    res.status(200).json({ ...other, token });
  } catch (error) {
    res.status(500).json({message: 'Server Error'});
  }
})

module.exports = router;