const express = require('express');
const router = express.Router();
const { Author, validateCreateAuthor, validateUpdateAuthor } = require('../models/Author');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */
router.get('/', async (req,res) => {
  const authors = await Author.find();
  res.status(200).json(authors);
})

/**
 * @desc Get author by ID
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
router.get('/:id', async (req,res) => {
  const author = await Author.find({_id: req.params.id});
  if(!author) return res.status(404).json({message:'Author Not Found'})
    res.status(200).json(author[0]);
})

/**
 * @desc Create author
 * @route /api/authors
 * @method POST
 * @access private (only admin)
 */
router.post('/', verifyTokenAndAdmin, async (req,res) => {
  // validate data
  const {error} = validateCreateAuthor(req.body);
  if (error) return res.status(400).json({message: error.details[0].message})

  // create author
  try {
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality,
      image: req.body.image
    })
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'});
  }
})

/**
 * @desc Update a author
 * @route /api/authors/:id
 * @method PUT
 * @access private (only admin)
 */
router.put('/:id', verifyTokenAndAdmin, async (req,res) => {
  // validate data
  const {error} = validateUpdateAuthor(req.body);
  if (error) return res.status(400).json({message: error.details[0].message})
  // find and update author
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality,
      image: req.body.image,
    },
    { new: true, runValidators: true })
    if (!updatedAuthor) return res.status(404).json({message:'Author Not Found'})
    
    await updatedAuthor.save();
    res.status(201).json(updatedAuthor);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'});
  }
  
})

/**
 * @desc Delete a author
 * @route /api/authors/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id)
    if (!author) return res.status(404).json({message:'Author Not Found'})
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'})
  }
})

module.exports = router;