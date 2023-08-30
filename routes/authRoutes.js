import express from 'express';
const router = express.Router();

import rateLimiter from 'express-rate-limit';
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
  enterCode,
  submitForm,
  forgotPassword,
  verifyToken,
  resetPassword,
  createCertificate
} from '../controllers/authController.js';

import authenticateUser from '../middleware/auth.js';
import testUser from '../middleware/testUser.js';
router.route('/register').post(apiLimiter, register);
router.route('/login').post( login);
router.get('/logout', logout);
router.route('/enterCode').post( enterCode);
router.route('/submitForm').post(submitForm)
router.route('/forgotpassword').post(forgotPassword)
router.route('/verifyToken').post(verifyToken)
router.route('/resetpassword').post(resetPassword)
router.route('/updateUser').patch(authenticateUser, testUser, updateUser);
router.route('/createCertificate').post(createCertificate);

export default router;
