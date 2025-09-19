const { Book } = require('./models/Book');
const { books } = require('./data');
const { connectDB } = require('./config/connect_db')
const { default: mongoose } = require('mongoose');
require('dotenv').config();

// Connection
connectDB();

// Import Books Inside Database
const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log('Books Imported ✅');
    process.exit(0); // exit program with success
  } catch(error) {
    console.log(`error : ${error} ❌`)
    mongoose.connection.close();
    process.exit(1); // exit program with error
  }
}

// Remove Books from Database
const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log('Books Removed ✅');
    process.exit(0); // exit program with success
  } catch(error) {
    console.log(`error : ${error} ❌`)
    mongoose.connection.close();
    process.exit(1); // exit program with error
  }
}

if (process.argv[2] === '-import') {
  importBooks();
} else if (process.argv[2] === '-remove') {
  removeBooks();
}