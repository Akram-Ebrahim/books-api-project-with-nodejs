const bcrypt = require('bcryptjs'); // Password Hashing
const { User, validateUpdateUser } = require('../models/User')

/**
 * @desc Get All Users
 * @route /api/users
 * @method GET
 * @access private (Only Admin)
 */
const getAllUsers = async (req,res) => {
  try {
    // find users
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
}

/**
 * @desc Update User
 * @route /api/users/:id
 * @method PUT
 * @access private
 */
const updateUser = async (req,res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  };

  try {
    // if password hash it before saving it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password,salt)
    }

    // headers
    console.log(req.headers);

    // find and update user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    }, { new: true }).select('-password');
    res.status(200).json(updatedUser);

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
}

/**
 * @desc Get User By Id
 * @route /api/users/:id
 * @method GET
 * @access private (Only Admin & User Himself)
 */
const getUserById = async (req,res) => {
  try {
    // find user
    const user = await User.findById(req.params.id).find('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User Not Found'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
}

/**
 * @desc Delete User
 * @route /api/users/:id
 * @method DELETE
 * @access private (Only Admin & User Himself)
 */
const deleteUser = async (req,res) => {
  // find and delete user
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({message:'User Not Found'})
    res.status(200).json({message: 'User Has Been Deleted Successfully'});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
}

module.exports = {
  getAllUsers,
  updateUser,
  getUserById,
  deleteUser
}