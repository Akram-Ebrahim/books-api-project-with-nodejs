const express = require('express');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const { 
  getAllAuthors,
  getAutherById,
  createAuthor,
  updateAuther,
  deleteAuther,

} = require('../controllers/authorsController');

// /api/authors
router.route('/')
      .get(getAllAuthors)
      .post(verifyTokenAndAdmin, createAuthor)

// /api/authors/:id
router.route('/:id')
      .get(getAutherById)
      .put(verifyTokenAndAdmin, updateAuther)
      .delete(verifyTokenAndAdmin, deleteAuther)

module.exports = router;