require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Oud Royal',
    brand: 'Maison Orient',
    description: 'Un parfum oriental intense aux notes de bois de oud, ambre et musc. Une fragrance majestueuse qui évoque le luxe du Moyen-Orient.',
    price: 4500,
    oldPrice: 5500,
    category: 'homme',
    volume: '100ml',
    stock: 25,
    isFeatured: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'],
    avgRating: 4.8,
    reviewCount: 12,
  },
  {
    name: 'Rose de Damas',
    brand: 'Fleurs du Monde',
    description: 'Une rose délicate et envoûtante, mêlée de jasmin et de patchouli. La quintessence de la féminité.',
    price: 3800,
    category: 'femme',
    volume: '75ml',
    stock: 18,
    isFeatured: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'],
    avgRating: 4.6,
    reviewCount: 8,
  },
  {
    name: 'Bois de Cèdre',
    brand: 'Forêt Noire',
    description: 'Fraîcheur boisée avec des notes de cèdre, vétiver et bergamote. Parfait pour l\'homme moderne.',
    price: 3200,
    category: 'homme',
    volume: '100ml',
    stock: 30,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600'],
    avgRating: 4.3,
    reviewCount: 5,
  },
  {
    name: 'Jasmin Blanc',
    brand: 'Fleurs du Monde',
    description: 'Un bouquet floral délicat de jasmin blanc, ylang-ylang et vanille douce. Légèreté et élégance.',
    price: 2900,
    oldPrice: 3500,
    category: 'femme',
    volume: '50ml',
    stock: 22,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600'],
    avgRating: 4.5,
    reviewCount: 9,
  },
  {
    name: 'Ambre Noir',
    brand: 'Maison Orient',
    description: 'Un accord ambré profond et sensuel, avec des touches de vanille, encens et bois précieux.',
    price: 5200,
    category: 'unisex',
    volume: '100ml',
    stock: 15,
    isFeatured: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600'],
    avgRating: 4.9,
    reviewCount: 15,
  },
  {
    name: 'Aqua Marine',
    brand: 'Blue Ocean',
    description: 'Fraîcheur aquatique et marine, notes d\'agrumes, sel marin et bois blanc. Idéal pour l\'été.',
    price: 2500,
    category: 'homme',
    volume: '100ml',
    stock: 40,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600'],
    avgRating: 4.1,
    reviewCount: 6,
  },
  {
    name: 'Fleur de Cerisier',
    brand: 'Sakura',
    description: 'Douceur florale inspirée des cerisiers japonais. Notes de cerise, pivoine et musc blanc.',
    price: 3100,
    category: 'femme',
    volume: '75ml',
    stock: 20,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1588514912908-b2f8e3e5e9e4?w=600'],
    avgRating: 4.4,
    reviewCount: 7,
  },
  {
    name: 'Musk Velvet',
    brand: 'Velvet Collection',
    description: 'Un musc doux et enveloppant, mêlé de santal, iris et poudre de riz. Unisexe et intemporel.',
    price: 3600,
    category: 'unisex',
    volume: '100ml',
    stock: 28,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1590156562745-5d5e0e5e5e5e?w=600'],
    avgRating: 4.7,
    reviewCount: 11,
  },
  {
    name: 'Petit Prince',
    brand: 'Douceur Enfantine',
    description: 'Fragrance douce et légère pour enfants. Notes de talc, vanille et fleurs blanches. Sans allergènes.',
    price: 1800,
    category: 'enfant',
    volume: '50ml',
    stock: 35,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'],
    avgRating: 4.2,
    reviewCount: 4,
  },
  {
    name: 'Oud Saffron',
    brand: 'Maison Orient',
    description: 'L\'alliance royale du oud et du safran, rehaussée de rose et d\'ambre. Un chef-d\'œuvre olfactif.',
    price: 6800,
    oldPrice: 8000,
    category: 'unisex',
    volume: '100ml',
    stock: 10,
    isFeatured: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'],
    avgRating: 5.0,
    reviewCount: 20,
  },
  {
    name: 'Lavande Provence',
    brand: 'Herbes du Sud',
    description: 'La lavande authentique de Provence, fraîche et apaisante. Notes herbacées et boisées.',
    price: 2200,
    category: 'homme',
    volume: '100ml',
    stock: 45,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600'],
    avgRating: 4.0,
    reviewCount: 3,
  },
  {
    name: 'Nuit Étoilée',
    brand: 'Velvet Collection',
    description: 'Mystérieux et séduisant, ce parfum nocturne mêle iris, violette et bois de santal fumé.',
    price: 4200,
    category: 'femme',
    volume: '75ml',
    stock: 16,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'],
    avgRating: 4.6,
    reviewCount: 10,
  },
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
