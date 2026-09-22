const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProduct);
router.post('/:id/like', protect, ctrl.toggleLike);
router.post('/:id/dislike', protect, ctrl.toggleDislike);

module.exports = router;
