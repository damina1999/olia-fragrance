import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get('/products?limit=8&sort=rating')
      .then(res => setFeatured(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (events.length <= 1) return;
    timerRef.current = setInterval(() => setCurrentSlide(p => (p + 1) % events.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [events]);

  const goTo = (i) => {
    setCurrentSlide(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrentSlide(p => (p + 1) % events.length), 5000);
  };

  const prev = () => goTo((currentSlide - 1 + events.length) % events.length);
  const next = () => goTo((currentSlide + 1) % events.length);

  // Reveal-on-scroll and parallax helpers
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.will-animate').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = document.querySelector('.parallax-media');
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = Math.max(-80, Math.min(80, (window.innerHeight / 2 - rect.top) * 0.06));
      el.style.transform = `translateY(${offset}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden text-white isolate bg-dark-900">
        {/* Background video — put a file at /public/videos/hero.mp4 or replace the src with your hosted video URL */}
        <video className="absolute inset-0 w-full h-full object-cover opacity-40" autoPlay muted loop playsInline>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 opacity-75"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 10%, rgba(212,168,67,0.22), transparent 35%), radial-gradient(circle at 85% 80%, rgba(35,37,58,0.6), transparent 35%), linear-gradient(120deg, #0d0f1a 0%, #121526 45%, #0f1120 100%)"
          }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(212,168,67,0.18), rgba(212,168,67,0.18) 1px, transparent 1px, transparent 28px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gold-400 font-medium tracking-[0.22em] uppercase text-xs md:text-sm mb-4">Collection Exclusive</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[0.94] mb-4">Olia<br />Fragrance</h1>
              <p className="text-gold-300 font-serif italic text-lg md:text-xl mb-6">The Essence of Beauty</p>
              <p className="text-white/75 text-lg max-w-xl mb-9 leading-relaxed">
                Une maison olfactive moderne qui marie sillage raffine, matieres nobles et personnalite. Choisissez un parfum qui marque votre presence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary text-base px-8 py-3">Explorer la boutique</Link>
                <Link to="/products?category=femme" className="btn-outline text-base px-8 py-3 border-white/20 text-white hover:text-dark-900 hover:bg-gold-300">Pour elle</Link>
                <Link to="/products?category=homme" className="btn-outline text-base px-8 py-3 border-white/20 text-white hover:text-dark-900 hover:bg-gold-300">Pour lui</Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-4 py-3 will-animate">
                  <p className="text-gold-300 text-xl font-semibold">12</p>
                  <p className="text-xs uppercase tracking-wide text-white/70">Signatures</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-4 py-3 will-animate">
                  <p className="text-gold-300 text-xl font-semibold">24h</p>
                  <p className="text-xs uppercase tracking-wide text-white/70">Expedition</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-4 py-3 will-animate">
                  <p className="text-gold-300 text-xl font-semibold">4.9</p>
                  <p className="text-xs uppercase tracking-wide text-white/70">Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 bg-gold-400/10 blur-3xl rounded-full will-animate" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] will-animate">
                <div className="parallax-media overflow-hidden rounded-[1.6rem] w-full h-[420px] md:h-[520px]">
                  <img
                    src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80"
                    alt="Parfum de luxe"
                    className="w-full h-full object-cover transform-gpu transition-transform duration-700"
                  />
                </div>
                <div className="absolute bottom-7 left-7 right-7 rounded-2xl bg-dark-900/72 border border-white/15 px-5 py-4 will-animate">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-300 mb-1">Edition Signature</p>
                  <p className="font-serif text-2xl">Sillage Precieux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Carousel */}
      {events.length > 0 && (
        <section className="relative overflow-hidden bg-dark-900">
          <div className="relative h-64 md:h-96">
            {events.map((ev, i) => (
              <div
                key={ev._id}
                className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {ev.image ? (
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-dark-800 to-dark-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                  <span className="inline-block bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                    Événement
                  </span>
                  <h3 className="font-serif text-2xl md:text-4xl font-bold mb-2">{ev.title}</h3>
                  {ev.description && <p className="text-white/80 text-sm md:text-base max-w-xl">{ev.description}</p>}
                  {ev.link && (
                    <a href={ev.link} target="_blank" rel="noreferrer"
                      className="inline-block mt-3 text-gold-400 hover:text-gold-300 text-sm font-medium underline underline-offset-4">
                      En savoir plus →
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Arrows */}
            {events.length > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </>
            )}

            {/* Dots */}
            {events.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {events.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 h-2 bg-gold-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-gold-500 tracking-[0.26em] uppercase text-xs font-medium mb-2">Explorez</p>
          <h2 className="text-4xl md:text-5xl font-serif text-dark-900">Nos Collections</h2>
          <p className="text-muted max-w-xl mx-auto mt-4">Une selection equilibree entre elegant, intense et lumineux, concue pour chaque identite.</p>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Pour Homme', sub: 'Boisé & Intense', value: 'homme', bg: 'from-slate-800 to-slate-600', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="8" r="4"/><path d="M16 8h2M18 6v4M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/></svg> },
            { label: 'Pour Femme', sub: 'Floral & Délicat', value: 'femme', bg: 'from-rose-900 to-rose-700', img: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> },
            { label: 'Unisex', sub: 'Ambré & Mystérieux', value: 'unisex', bg: 'from-amber-900 to-amber-700', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg> },
            { label: 'Enfant', sub: 'Doux & Frais', value: 'enfant', bg: 'from-teal-800 to-teal-600', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 22s-8-5.686-8-11a8 8 0 0116 0c0 5.314-8 11-8 11z"/><circle cx="12" cy="11" r="3"/></svg> },
          ].map((cat, i) => (
            <Link key={cat.value} to={`/products?category=${cat.value}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
              <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <div className="mb-3 opacity-80 group-hover:opacity-100 transform group-hover:-translate-y-1 transition-all duration-300">{cat.icon}</div>
                <h3 className="font-serif text-xl font-semibold mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">{cat.label}</h3>
                <p className="text-white/70 text-xs tracking-wider uppercase transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">{cat.sub}</p>
                <div className="mt-3 w-8 h-0.5 bg-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold-500 tracking-[0.2em] uppercase text-xs font-medium mb-2">Selection Premium</p>
            <h2 className="text-3xl md:text-4xl font-serif">Meilleures Ventes</h2>
          </div>
          <Link to="/products" className="text-gold-500 hover:text-gold-600 font-medium text-sm">Voir tout →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-dark-900 to-dark-800 text-white py-16 text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #d4a843, transparent 20%), radial-gradient(circle at 80% 70%, #d4a843, transparent 20%)' }} />
        <h2 className="relative font-serif text-3xl md:text-4xl mb-3">Livraison 8 DT — Gratuite des 100 DT</h2>
        <p className="relative text-white/65 mb-6">Commandez maintenant et recevez votre parfum en 24-48h</p>
        <Link to="/products" className="btn-primary px-10 py-3 text-base">Commander maintenant</Link>
      </section>
    </div>
  );
}
