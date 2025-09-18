const jwt = require('jsonwebtoken');

// Verify Token
function verifyToken(req,res,next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({message: "Invalid Token"})
    }
  } else {
    res.status(401).json({message: "No Token Provided"})
  }
}

// Vefify Token & Authorization
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({message: "You Are Not Allowed"})
    }
  })
}

// Vefify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({message: "You Are Not Allowed, Only Admin Allowed"})
    }
  })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }