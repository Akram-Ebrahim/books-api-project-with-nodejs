const mongoose = require('mongoose');
const joi = require('joi'); // for data validation
const jwt = require('jsonwebtoken'); // Json Web Token
const joiPasswordComplexity = require('joi-password-complexity');

// Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 200,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLength: 5,
    maxLength: 100,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

// Generate Token
userSchema.methods.generateToken = function() {
  return jwt.sign( { id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' } );
}

const User = mongoose.model('User', userSchema);

// Validation Functions
function validateRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(200).required(),
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joiPasswordComplexity().required(),
  })
  return schema.validate(obj);
}
function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(6).required(),
  })
  return schema.validate(obj);
}
function validateUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(200),
    email: joi.string().trim().min(5).max(100).email(),
    password: joiPasswordComplexity(),
  })
  return schema.validate(obj);
}
function validateChangePassword(obj) {
  const schema = joi.object({
    password: joiPasswordComplexity().required(),
  })
  return schema.validate(obj);
}

module.exports = { User, validateRegisterUser, validateLoginUser, validateUpdateUser, validateChangePassword }