require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  { name: 'Olia Signature 1', brand: 'Olia Fragrance', description: 'La signature Olia — élégant et intemporel.', category: 'unisex', images: ['/images/olia-1.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 2', brand: 'Olia Fragrance', description: 'Aromatic composition, notes carefully selected.', category: 'unisex', images: ['/images/olia-2.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 3', brand: 'Olia Fragrance', description: 'Elegance and long lasting sillage.', category: 'unisex', images: ['/images/olia-3.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 4', brand: 'Olia Fragrance', description: 'Fruity and rich top notes.', category: 'unisex', images: ['/images/olia-4.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 5', brand: 'Olia Fragrance', description: 'Warm amber heart with vanilla.', category: 'unisex', images: ['/images/olia-5.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 6', brand: 'Olia Fragrance', description: 'Fresh citrus and marine accord.', category: 'unisex', images: ['/images/olia-6.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 7', brand: 'Olia Fragrance', description: 'Floral bouquet with soft musk.', category: 'unisex', images: ['/images/olia-7.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 8', brand: 'Olia Fragrance', description: 'Spicy and gourmand nuances.', category: 'unisex', images: ['/images/olia-8.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 9', brand: 'Olia Fragrance', description: 'Delicate rose and vanilla.', category: 'unisex', images: ['/images/olia-9.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 10', brand: 'Olia Fragrance', description: 'Classic woody aromatic blend.', category: 'unisex', images: ['/images/olia-10.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 11', brand: 'Olia Fragrance', description: 'Bright citrus medley.', category: 'unisex', images: ['/images/olia-11.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
  { name: 'Olia Signature 12', brand: 'Olia Fragrance', description: 'Vanilla powder and gourmand finish.', category: 'unisex', images: ['/images/olia-12.jpg'], variants: [{ volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 }, { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }], isFeatured: true, isActive: true, avgRating: 0, reviewCount: 0 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Données existantes supprimées');

    // Create admin user
    const admin = await User.create({
      name: 'Administrateur',
      email: 'admin@parfumshop.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });
    console.log('👤 Admin créé: admin@parfumshop.com / admin123');

    // Create test client
    await User.create({
      name: 'Client Test',
      email: 'client@parfumshop.com',
      password: 'client123',
      role: 'client',
      isVerified: true,
    });
    console.log('👤 Client créé: client@parfumshop.com / client123');

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits insérés`);

    console.log('\n🎉 Base de données initialisée avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  admin@parfumshop.com  /  admin123');
    console.log('Client: client@parfumshop.com /  client123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

seed();
