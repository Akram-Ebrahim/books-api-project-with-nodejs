const express = require('express');

// Database Connection
const { connectDB } = require('./config/connect_db');
connectDB();

// Init app
const app = express();

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); // URL Encoded (Get Email From View)

// Custom middleware to log requests
app.use(require('./middlewares/logger'));

// set ejs
app.set('view engine', 'ejs')

// Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/password', require('./routes/password'));

// Custom middleware to handle errors //![must be after routes]
const { errorHandler, notFound } = require('./middlewares/errors');
app.use(notFound);
app.use(errorHandler);

app.get('/', (req,res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f4f6f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          h1 {
            font-family: Arial, sans-serif;
            color: #333;
            background: #fff;
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>🚀 Welcome To Our API ✅</h1>
      </body>
    </html>
  `);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));