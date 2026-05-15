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
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-gold-500 tracking-widest uppercase text-xs font-medium mb-2">Explorez</p>
          <h2 className="text-4xl font-serif text-dark-900">Nos Collections</h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              label: 'Pour Homme',
              sub: 'Boisé & Intense',
              value: 'homme',
              bg: 'from-slate-800 to-slate-600',
              img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                  <circle cx="12" cy="8" r="4"/><path d="M16 8h2M18 6v4M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
                </svg>
              ),
            },
            {
              label: 'Pour Femme',
              sub: 'Floral & Délicat',
              value: 'femme',
              bg: 'from-rose-900 to-rose-700',
              img: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                  <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
              ),
            },
            {
              label: 'Unisex',
              sub: 'Ambré & Mystérieux',
              value: 'unisex',
              bg: 'from-amber-900 to-amber-700',
              img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              ),
            },
            {
              label: 'Enfant',
              sub: 'Doux & Frais',
              value: 'enfant',
              bg: 'from-teal-800 to-teal-600',
              img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                  <path d="M12 22s-8-5.686-8-11a8 8 0 0116 0c0 5.314-8 11-8 11z"/><circle cx="12" cy="11" r="3"/>
                </svg>
              ),
            },
          ].map((cat, i) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Background image */}
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)' }} />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <div className="mb-3 opacity-80 group-hover:opacity-100 transform group-hover:-translate-y-1 transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                  {cat.label}
                </h3>
                <p className="text-white/70 text-xs tracking-wider uppercase transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {cat.sub}
                </p>
                <div className="mt-3 w-8 h-0.5 bg-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
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
