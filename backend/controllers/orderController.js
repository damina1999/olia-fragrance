const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;
  try {
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) return res.status(400).json({ message: `Produit indisponible` });

      // Use client-sent price (variant price) or fallback to product price
      const unitPrice = item.price ? Number(item.price) : product.price;
      const volume = item.volume || product.volume || '';

      // Find matching variant to check stock
      let stockAvailable = product.stock;
      if (product.variants?.length && volume) {
        const variant = product.variants.find(v => v.volume === volume);
        if (variant) stockAvailable = variant.stock;
      }

      if (stockAvailable < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name} ${volume}` });
      }

      totalPrice += unitPrice * item.quantity;
      orderItems.push({
        product: product._id,
        name: item.name || product.name,
        image: product.images?.[0] || '',
        price: unitPrice,
        volume,
        quantity: item.quantity,
      });

      // Decrease stock
      if (product.variants?.length && volume) {
        const vIdx = product.variants.findIndex(v => v.volume === volume);
        if (vIdx !== -1) {
          product.variants[vIdx].stock -= item.quantity;
          product.stock = product.variants.reduce((s, v) => s + v.stock, 0);
          product.markModified('variants');
        }
      } else {
        product.stock -= item.quantity;
      }
      await product.save();
    }

    const shippingPrice = totalPrice >= 100 ? 0 : 8;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      shippingPrice,
      notes,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Non autorisé' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
