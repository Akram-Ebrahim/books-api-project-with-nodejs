const express = require('express');
const router = express.Router();
const { 
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('../middlewares/verifyToken'); // Custom middleware >> verify token provided & return user._id, user.isAdmin
const { 
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser
} = require('../controllers/usersController');


// /api/users
router.get('/', verifyTokenAndAdmin, getAllUsers)

// /api/users/:id
router.route('/:id')
      .put(verifyTokenAndAuthorization, updateUser)
      .get(verifyTokenAndAuthorization, getUserById)
      .delete(verifyTokenAndAuthorization, deleteUser)

module.exports = router;