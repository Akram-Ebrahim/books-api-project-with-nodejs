const express = require('express');
const router = express.Router();
const { 
      getForgetPasswordView,
      sendForgetPasswordLink,
      getResetPasswordView,
      resetThePassword
} = require('../controllers/resetPasswordController')

router.route('/forget-password')
      .get(getForgetPasswordView)
      .post(sendForgetPasswordLink)

router.route('/reset-password/:userId/:token')
      .get(getResetPasswordView)
      .post(resetThePassword)

module.exports = router;