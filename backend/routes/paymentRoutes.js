
const express = require('express');
const router = express.Router();

const {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

router.post('/initiate', protect, initiatePayment);

router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);

module.exports = router;
