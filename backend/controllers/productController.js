const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { avgRating: -1 },
      popular: { reviewCount: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });

    const uid = req.user._id;
    const liked = product.likes.includes(uid);
    if (liked) {
      product.likes.pull(uid);
    } else {
      product.likes.addToSet(uid);
      product.dislikes.pull(uid); // remove dislike if exists
    }
    await product.save();
    res.json({ likes: product.likes.length, dislikes: product.dislikes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products/:id/dislike
exports.toggleDislike = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });

    const uid = req.user._id;
    const disliked = product.dislikes.includes(uid);
    if (disliked) {
      product.dislikes.pull(uid);
    } else {
      product.dislikes.addToSet(uid);
      product.likes.pull(uid);
    }
    await product.save();
    res.json({ likes: product.likes.length, dislikes: product.dislikes.length, disliked: !disliked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
