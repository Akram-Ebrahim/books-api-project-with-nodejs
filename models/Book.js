const mongoose = require('mongoose');
const joi = require('joi'); // for data validation

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLenght: 3,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLenght: 5,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1450,
    max: new Date().getFullYear(),
  },
  pages: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
  },
  price: {
    type: mongoose.Schema.Types.Double,
    required: true,
    min: 0,
  },
  cover: {
    type: String,
    trim: true,
    required: true,
    enum: ['soft cover', 'hard cover']
  }
}, { timestamps: true });

// Validation Functions
function validateCreateBook(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(3).required(),
    description: joi.string().trim().min(5).required(),
    author: joi.string().required(),
    year: joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
    pages: joi.number().integer().min(1).required(),
    genre: joi.string().trim().min(3).required(),
    price: joi.number().min(0).required(),
    cover: joi.string().valid('soft cover', 'hard cover').required(),
  })
  return schema.validate(obj);
}
function validateUpdateBook(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(3),
    description: joi.string().trim().min(5),
    author: joi.string().trim().min(3),
    year: joi.number().integer().min(1000).max(new Date().getFullYear()),
    pages: joi.number().integer().min(1),
    genre: joi.string().trim().min(3),
    price: joi.number().min(0),
    cover: joi.string().valid('soft cover', 'hard cover'),
  })
  return schema.validate(obj);
}

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book, validateCreateBook, validateUpdateBook }