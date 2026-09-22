const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Vous avez déjà noté ce produit' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      comment,
    });
    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis introuvable' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Non autorisé' });

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis introuvable' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Non autorisé' });

    await review.deleteOne();
    res.json({ message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
