const express = require('express');
const router = express.Router();
const { Book, validateCreateBook, validateUpdateBook } = require('../models/Book');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get('/', async (req,res) => {
  // Accept Queries From Client & Filter
  const { minPrice, maxPrice, pageNumber } = req.query;
  const booksPerPage = 2;
  let books;
  if (minPrice && maxPrice) {
    books = await Book.find({price: {$gte:minPrice,$lte:maxPrice}})
    .populate('author', [
      '_id',
      'firstName',
      'lastName'
    ])
  } else {
    books = await Book.find()
    .populate('author', [
      '_id',
      'firstName',
      'lastName'
    ])
    // Pagination
    .skip((pageNumber - 1) * booksPerPage).limit(booksPerPage) // skip 2 rows && show 2 after them
  }
  res.status(200).json(books);
})

/**
 * @desc Get book by ID
 * @route /api/books/:id
 * @method GET
 * @access public
 */
router.get('/:id', async (req,res) => {
  const book = await Book.findById({_id:req.params.id}).populate('author');
  if(!book) return res.status(404).json({message:'Book Not Found'})
  res.status(200).json(book);
})

/**
 * @desc Create a book
 * @route /api/books
 * @method POST
 * @access private (only admin)
 */
router.post('/', verifyTokenAndAdmin, async (req,res) => {
  // validate data
  const {error} = validateCreateBook(req.body);
  if (error) return res.status(400).json({message: error.details[0].message})

  // create book
  try {
    const book = new Book({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      year: req.body.year,
      pages: req.body.pages,
      genre: req.body.genre,
      price: req.body.price,
      cover: req.body.cover,
    })
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'});
  }
})

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access private (only admin)
 */
router.put('/:id', verifyTokenAndAdmin, async (req,res) => {
  // validate data
  const {error} = validateUpdateBook(req.body);
  if (error) return res.status(400).json({message: error.details[0].message});
  // update book
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    year: req.body.year,
    pages: req.body.pages,
    genre: req.body.genre,
    price: req.body.price,
    cover: req.body.cover,
  },
  { new: true, runValidators: true });
  if (!updatedBook) return res.status(404).json({message:'Book Not Found'});
  
  await updatedBook.save();
  res.status(201).json(updatedBook);
})
/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
  // find and delete book
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({message:'Book Not Found'})
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'})
  }
})

module.exports = router;