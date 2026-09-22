const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function () {
  const product = await mongoose.model('Product').findById(this.product);
  if (product) await product.updateRating();
});

reviewSchema.post('remove', async function () {
  const product = await mongoose.model('Product').findById(this.product);
  if (product) await product.updateRating();
});

module.exports = mongoose.model('Review', reviewSchema);
