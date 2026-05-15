const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number },
  category: { type: String, enum: ['homme', 'femme', 'unisex', 'enfant'], required: true },
  brand: { type: String, required: true },
  volume: { type: String }, // ex: "100ml"
  images: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

// Update avg rating
productSchema.methods.updateRating = async function () {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { product: this._id } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  this.avgRating = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0;
  this.reviewCount = stats.length ? stats[0].count : 0;
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);
