const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

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
    res.json({message: 'Click On The Link Bellow', resetPasswordLink: link});

    // TODO: Send Email To The User
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
  // TODO: Validation Password
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