const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, ctrl.createOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.get('/:id', protect, ctrl.getOrder);

module.exports = router;
