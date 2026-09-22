const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  const db = mongoose.connection.db;

  // Products compound index for common queries
  await db.collection('products').createIndex({ isActive: 1, category: 1, price: 1, avgRating: -1 });
  console.log('Created products compound index');

  // Text index for search
  await db.collection('products').createIndex({ name: 'text', brand: 'text', description: 'text' }, { name: 'ProductsTextIndex' });
  console.log('Created products text index');

  // Orders index
  await db.collection('orders').createIndex({ user: 1, status: 1, createdAt: -1 });
  console.log('Created orders index');

  // Reviews index
  await db.collection('reviews').createIndex({ product: 1, rating: -1 });
  console.log('Created reviews index');

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
