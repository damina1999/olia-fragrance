const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/product/:productId', ctrl.getReviews);
router.post('/product/:productId', protect, ctrl.addReview);
router.put('/:id', protect, ctrl.updateReview);
router.delete('/:id', protect, ctrl.deleteReview);

module.exports = router;
