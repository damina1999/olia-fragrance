const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueData, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'client' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenueData[0]?.total || 0,
      ordersByStatus,
      recentOrders,
      monthlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Products
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { brand: new RegExp(search, 'i') }] } : {};
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const images = req.files?.map(f => f.path) || [];
    const data = {
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      volume: req.body.volume || '',
      category: req.body.category,
      price: Number(req.body.price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
      stock: Number(req.body.stock),
      isFeatured: req.body.isFeatured === 'true',
      isActive: req.body.isActive !== 'false',
      images,
    };
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Remove fields that should not be updated via form
    const { likes, dislikes, avgRating, reviewCount, createdAt, updatedAt, _id, __v, ...rest } = req.body;
    const update = {
      ...rest,
      price: Number(rest.price),
      oldPrice: rest.oldPrice ? Number(rest.oldPrice) : undefined,
      stock: Number(rest.stock),
      isFeatured: rest.isFeatured === 'true',
      isActive: rest.isActive !== 'false',
    };
    if (req.files?.length) update.images = req.files.map(f => f.path);
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Orders
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('user', 'name email phone'),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reviews
const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { comment: new RegExp(search, 'i') } : {};
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name email avatar')
        .populate('product', 'name images')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);
    res.json({ reviews, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis introuvable' });
    // Update product rating
    const product = await require('../models/Product').findById(review.product);
    if (product) await product.updateRating();
    res.json({ message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
