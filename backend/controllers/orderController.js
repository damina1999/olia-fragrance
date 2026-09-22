const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes, guestEmail, guestPhone } = req.body;
  try {
    // Guest must provide email or phone
    if (!req.user && !guestEmail && !guestPhone) {
      return res.status(400).json({ message: 'Email ou téléphone requis pour les commandes invités' });
    }

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

    const orderData = {
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      shippingPrice,
      notes,
    };

    // Attach user or guest info
    if (req.user) {
      orderData.user = req.user._id;
    } else {
      if (guestEmail) orderData.guestEmail = guestEmail.toLowerCase().trim();
      if (guestPhone) orderData.guestPhone = guestPhone.trim();
    }

    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    // Find orders by user ID, and also by matching email (for guest orders linked to account)
    const conditions = [{ user: req.user._id }];
    if (req.user.email) {
      conditions.push({ guestEmail: req.user.email.toLowerCase() });
    }
    const orders = await Order.find({ $or: conditions }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    // Allow access if: owner, admin, or guest order (no user attached)
    if (order.user) {
      if (order.user.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Non autorisé' });
      }
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Guest order tracking — no auth required
exports.getGuestOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    // Only allow viewing guest orders (no user) or return limited info
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper to restore stock when cancelling
async function restoreStock(items) {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const volume = item.volume || '';
    if (product.variants?.length && volume) {
      const vIdx = product.variants.findIndex(v => v.volume === volume);
      if (vIdx !== -1) {
        product.variants[vIdx].stock += item.quantity;
        product.stock = product.variants.reduce((s, v) => s + v.stock, 0);
        product.markModified('variants');
      }
    } else {
      product.stock += item.quantity;
    }
    await product.save();
  }
}

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    // Check ownership: logged-in user must own the order, or it must be a guest order
    if (order.user) {
      if (!req.user || order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
    }

    // Check if order can be cancelled (status must be pending or confirmed)
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cette commande ne peut plus être annulée (déjà en traitement ou livrée)' });
    }

    // Check 12-hour window
    const hoursSinceCreation = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation >= 12) {
      return res.status(400).json({ message: 'Le délai d\'annulation de 12h est dépassé' });
    }

    // Cancel and restore stock
    order.status = 'cancelled';
    await order.save();
    await restoreStock(order.items);

    res.json({ message: 'Commande annulée avec succès', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export restoreStock for use by admin controller
exports.restoreStock = restoreStock;
