const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');

// Guest or logged-in: create order
router.post('/', optionalAuth, ctrl.createOrder);

// Logged-in only: get my orders
router.get('/my', protect, ctrl.getMyOrders);

// Guest order tracking (no auth needed)
router.get('/guest/:id', ctrl.getGuestOrder);

// Cancel order (guest or logged-in, within 12h)
router.post('/:id/cancel', optionalAuth, ctrl.cancelOrder);

// Get single order (auth required for user orders)
router.get('/:id', optionalAuth, ctrl.getOrder);

module.exports = router;
