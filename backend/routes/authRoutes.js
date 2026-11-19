const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getProfile, getAdminDashboard } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/admin', protect, admin, getAdminDashboard);

module.exports = router;