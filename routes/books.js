const express = require('express');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const { 
  getAllBooks,
  getBookById,
  createABook,
  updateABook,
  deleteABook
} = require('../controllers/booksController');

// /api/books
router.route('/')
      .get(getAllBooks)
      .post(verifyTokenAndAdmin, createABook)

// /api/books/:id
router.route('/:id')
      .get(getBookById)
      .put(verifyTokenAndAdmin, updateABook)
      .delete(verifyTokenAndAdmin, deleteABook)

module.exports = router;