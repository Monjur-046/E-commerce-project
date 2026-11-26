
const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    getAdminDashboard,
    changeAdminCredentials,
    changePassword,
    forgotPassword,
    resetPassword,
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);

router.get('/admin', protect, admin, getAdminDashboard);
router.put('/admin/account', protect, admin, changeAdminCredentials);

router.post('/admin/create', protect, admin, createAdmin);
router.get('/admin/list', protect, admin, getAllAdmins);
router.put('/admin/:id', protect, admin, updateAdmin);
router.delete('/admin/:id', protect, admin, deleteAdmin);

module.exports = router;
