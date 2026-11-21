
const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelMyOrder
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', protect, createOrder);

router.get('/my-orders', protect, getMyOrders);

router.get('/admin/all', protect, admin, getAllOrders);
router.put('/admin/:id', protect, admin, updateOrderStatus);

router.put('/:id/cancel', protect, cancelMyOrder);

router.get('/:id', protect, getOrderById);

module.exports = router;
