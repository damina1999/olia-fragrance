require('dotenv').config({ path: __dirname + '/../.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const Product = require('../models/Product');

const defaultImages = [
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&q=80',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
  'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&q=80',
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80',
  'https://images.unsplash.com/photo-1512777576244-b846ac3d816f?w=800&q=80',
  'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&q=80',
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&q=80'
];

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);
    
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      // If product images contain broken /images/ or empty, replace with HD perfume photo
      if (!p.images || !p.images.length || p.images[0].startsWith('/images/')) {
        const newImg = defaultImages[i % defaultImages.length];
        p.images = [newImg];
        await p.save();
        console.log(`Updated ${p.name} -> ${newImg}`);
      }
    }
    
    console.log('Finished updating product images!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
}

updateImages();
