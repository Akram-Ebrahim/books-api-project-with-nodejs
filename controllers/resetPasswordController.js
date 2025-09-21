const { User, validateChangePassword } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * @desc get Forget Password View
 * @route /password
 * @method GET
 * @access public
 */
const getForgetPasswordView = (req,res) => {
  res.render('forget-password');
}

/**
 * @desc Send Forget Password Link
 * @route /password/reset-password
 * @method POST
 * @access public
 */
const sendForgetPasswordLink = async (req,res) => {
  try {
    // Check User Available
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return res.status(404).json({message: 'User Not Found'});
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    // combine token with old password - if changes the link will be invalid (used once!)
    const token = jwt.sign({ email: user.email, id: user._id}, secret, {expiresIn: '10m'});

    const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;
    
    // Send Link Via Email
    const transporter =  nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL, // Sender
        pass: process.env.USER_APP_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.USER_EMAIL, // Sender
      to: user.email,
      subject: 'Reset Password',
      html: `
        <div>
          <h4>Click on the link below to reset your password</h4>
          <p><a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></p>
          <p>This link expires in 10 minutes.</p>
        </div>
      `
    }

    transporter.sendMail(mailOptions, function(error,success) {
      if (error) {
        console.log(error);
        return res.status(500).json({message: 'Something Went Wrong'});
      }
      
      console.log('Email Sent: ' + success.response);
      res.render('link-send');
    })
    
  } catch (error) {
    console.log(error);
  }
}

/**
 * @desc Send Forget Password Link
 * @route /password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
const getResetPasswordView = async (req,res) => {
  // Check User Available
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({message: 'User Not Found'})
  }

  try {
    const secret = process.env.JWT_SECRET_KEY + user.password;
    jwt.verify(req.params.token, secret);
    res.render('reset-password', {email: user.email});
  } catch (error) {
    console.log(error);
    res.json({message: `${error}`})
  }
}

/**
 * @desc Reset The Password
 * @route /password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
const resetThePassword = async (req,res) => {
  // Password Validation
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(500).json({message: error.details[0].message});
  }
  // Check User Available
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({message: 'User Not Found'})
  }

  try {
    const secret = process.env.JWT_SECRET_KEY + user.password;
    jwt.verify(req.params.token, secret);

    // Update Password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt)
    user.password = req.body.password;
    await user.save();
    res.render('success-password')
  } catch (error) {
    console.log(error);
    res.json({message: `${error}`})
  }
}

module.exports = { getForgetPasswordView, sendForgetPasswordLink, getResetPasswordView, resetThePassword }