
const express = require('express');
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update/:productId', protect, updateCartItem);
router.delete('/remove/:productId', protect, removeFromCart);

module.exports = router;
