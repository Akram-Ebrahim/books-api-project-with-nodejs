const mongoose = require('mongoose');
const joi = require('joi'); // for data validation

const AuthorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    trim: true
  },
  birthYear: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear(),
    trim: true,
  },
  nationality: {
    type: String,
    required: true,
    min: 3,
    trim: true
  },
  image: {
    type: String,
    default: 'deault-avatar.png'
  }
}, {timestamps: true})

// Validation Functions
function validateCreateAuthor(obj) {
  const schema = joi.object({
    firstName: joi.string().trim().min(3).required(),
    lastName: joi.string().trim().min(3).required(),
    birthYear: joi.number().integer().min(2000).max(new Date().getFullYear() - 10).required(),
    nationality: joi.string().trim().min(3).required(),
    image: joi.string().trim().min(5).required(),
  })
  return schema.validate(obj);
}
function validateUpdateAuthor(obj) {
  const schema = joi.object({
    firstName: joi.string().trim().min(3),
    lastName: joi.string().trim().min(3),
    birthYear: joi.number().integer().min(2000).max(new Date().getFullYear() - 10),
    nationality: joi.string().trim().min(3),
    image: joi.string().trim().min(5),
  })
  return schema.validate(obj);
}

const Author = mongoose.model('Author', AuthorSchema);

module.exports = { Author, validateCreateAuthor, validateUpdateAuthor }