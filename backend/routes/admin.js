const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect, adminOnly);

// Multer error handler wrapper
const uploadMiddleware = (field, max) => (req, res, next) => {
  upload.array(field, max)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ message: `Erreur upload: ${err.message}` });
    }
    next();
  });
};

// Dashboard stats
router.get('/stats', ctrl.getStats);

// Products CRUD
router.get('/products', ctrl.getProducts);
router.post('/products', uploadMiddleware('images', 5), ctrl.createProduct);
router.put('/products/:id', uploadMiddleware('images', 5), ctrl.updateProduct);
router.delete('/products/:id', ctrl.deleteProduct);

// Orders management
router.get('/orders', ctrl.getOrders);
router.put('/orders/:id/status', ctrl.updateOrderStatus);

// Users
router.get('/users', ctrl.getUsers);
router.put('/users/:id/role', ctrl.updateUserRole);

// Reviews
router.get('/reviews', ctrl.getAllReviews);
router.delete('/reviews/:id', ctrl.deleteReview);

// Events
router.get('/events', ctrl.getEvents);
router.post('/events', uploadMiddleware('images', 1), ctrl.createEvent);
router.put('/events/:id', uploadMiddleware('images', 1), ctrl.updateEvent);
router.delete('/events/:id', ctrl.deleteEvent);

module.exports = router;
