require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const customProducts = [
  {
    name: 'Summer Hammer',
    brand: 'Lorenzo Pazzaglia',
    description: 'Une explosion tropicale de mangue, ananas et rhum blanc. Parfum estival vibrant et envoûtant.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Le Beau Paradise Garden',
    brand: 'Jean Paul Gaultier',
    description: 'Un jardin d’Éden aquatique et boisé. Notes d’eau de coco, figue et bois de santal.',
    category: 'homme',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Vanilla Powder',
    brand: 'Matiere Premiere',
    description: 'Poudre de vanille de Madagascar relevée de noix de coco et de bois de santal précieux.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Boss Orange',
    brand: 'Hugo Boss',
    description: 'Sillage pétillant et chaleureux aux notes de pomme fraîche, vanille et fleurs d’oranger.',
    category: 'femme',
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Pacific Chill',
    brand: 'Louis Vuitton',
    description: 'Une bouffée de fraîcheur californienne avec cassis, cédrat, basilic et menthe fraîche.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Libre',
    brand: 'Yves Saint Laurent',
    description: 'Le parfum d’une femme libre. Fleur d’oranger du Maroc et lavande audacieuse de France.',
    category: 'femme',
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'La Bomba',
    brand: 'Olia Fragrance',
    description: 'Une explosion gourmande et ambrée irrésistible. Sillage intense et sophistiqué.',
    category: 'femme',
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Imagination',
    brand: 'Louis Vuitton',
    description: 'L’élégance ultime du thé noir de Chine, néroli de Calabre et ambre gris.',
    category: 'homme',
    images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Creed Aventus',
    brand: 'Creed',
    description: 'L’incontournable sillage de puissance. Ananas fumé, bouleau, mousse d’chêne et ambre gris.',
    category: 'homme',
    images: ['https://images.unsplash.com/photo-1512777576244-b846ac3d816f?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Prada Paradoxe',
    brand: 'Prada',
    description: 'Composition florale ambrée réinventée. Néroli frais, ambre chaud et musc blanc.',
    category: 'femme',
    images: ['https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Mancera Rose Vanille',
    brand: 'Mancera',
    description: 'Rose suave de Turquie mariée à la vanille bourbon et au sucre roux. Gourmandise absolue.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Mancera Coco Vanille',
    brand: 'Mancera',
    description: 'Douceur exotique de noix de coco, vanille des îles, tiaré et ylang-ylang.',
    category: 'femme',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Erba Pura',
    brand: 'Xerjoff',
    description: 'Un panier d’agrumes de Sicile infusé de fruits méditerranéens et de musc blanc captivant.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Pineapple',
    brand: 'Olia Fragrance',
    description: 'Nectar d’ananas juteux, cédrat et accords boisés solaires. Fraîcheur fruitée envoûtante.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: false,
    isActive: true
  },
  {
    name: 'One Million',
    brand: 'Paco Rabanne',
    description: 'Lingot d’or au sillage épicé, mandarine sanguine, cannelle et cuir ambré.',
    category: 'homme',
    images: ['https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'My Way',
    brand: 'Giorgio Armani',
    description: 'Bouquet floral lumineux de fleur d’oranger, tubéreuse et vanille de Madagascar.',
    category: 'femme',
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'L’Immensité',
    brand: 'Louis Vuitton',
    description: 'Un murmure de gingembre frais, pamplemousse, ambre et sauge sclarée.',
    category: 'homme',
    images: ['https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Apple Brandy',
    brand: 'Kilian',
    description: 'Elixir nocturne de liqueur de pomme, brandy, bergamote, cardamome et cèdre.',
    category: 'unisex',
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80'],
    price: 39.9,
    oldPrice: 49.9,
    variants: [
      { volume: '50ml', price: 39.9, oldPrice: 49.9, stock: 50 },
      { volume: '30ml', price: 29.9, oldPrice: 37.4, stock: 50 }
    ],
    isFeatured: true,
    isActive: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');

    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@parfumshop.com' });
    if (!adminExists) {
      await User.create({
        name: 'Administrateur',
        email: 'admin@parfumshop.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
      });
    }

    await Product.insertMany(customProducts);
    console.log(`✅ ${customProducts.length} produits de marque réinsérés !`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

seed();
