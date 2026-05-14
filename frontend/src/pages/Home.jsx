import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8&sort=rating')
      .then(res => {
        console.log('Products loaded:', res.data.products);
        setFeatured(res.data.products);
      })
      .catch(err => {
        console.error('Error loading products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-dark-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600')" }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-32">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-4">Collection Exclusive</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-3">
            Olia<br />Fragrance
          </h1>
          <p className="text-gold-400 font-serif italic text-lg mb-6">— The Essence of Beauty —</p>
          <p className="text-white/70 text-lg max-w-md mb-8">
            Découvrez notre sélection de parfums de luxe, soigneusement choisis pour sublimer chaque moment.
          </p>          <div className="flex gap-4">
            <Link to="/products" className="btn-primary text-base px-8 py-3">
              Explorer la boutique
            </Link>
            <Link to="/products?category=femme" className="btn-outline text-base px-8 py-3">
              Pour elle
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Nos Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pour Homme', value: 'homme', emoji: '🧔', color: 'from-blue-900 to-blue-700' },
            { label: 'Pour Femme', value: 'femme', emoji: '👩', color: 'from-pink-800 to-pink-600' },
            { label: 'Unisex', value: 'unisex', emoji: '✨', color: 'from-purple-900 to-purple-700' },
            { label: 'Enfant', value: 'enfant', emoji: '🌸', color: 'from-green-800 to-green-600' },
          ].map(cat => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className={`bg-gradient-to-br ${cat.color} text-white rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300`}
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="font-serif text-lg font-semibold">{cat.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif">Meilleures Ventes</h2>
          <Link to="/products" className="text-gold-500 hover:text-gold-600 font-medium text-sm">
            Voir tout →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-gradient-to-r from-dark-900 to-dark-800 text-white py-16 text-center">
        <h2 className="font-serif text-3xl mb-3">Livraison gratuite dès 5000 DT</h2>
        <p className="text-white/60 mb-6">Commandez maintenant et recevez votre parfum en 24-48h</p>
        <Link to="/products" className="btn-primary px-10 py-3 text-base">Commander maintenant</Link>
      </section>
    </div>
  );
}
