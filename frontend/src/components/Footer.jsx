import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-porcelain text-dark-900 mt-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-serif text-oldgold text-2xl mb-3 flex items-center gap-3">
            <img src="/logo.jpg" alt="Olia Fragrance" className="h-10 w-10 rounded-full object-cover" />
            Olia Fragrance
          </h3>
          <p className="text-sm leading-relaxed text-muted">The Essence of Beauty. Votre destination pour les parfums de luxe.</p>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Inscrivez-vous</h4>
            <form className="flex gap-2 max-w-md">
              <input className="input-field" placeholder="Votre e-mail" />
              <button className="btn-primary">S'abonner</button>
            </form>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-dark-900 mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/" className="hover:text-oldgold transition">Accueil</Link></li>
            <li><Link to="/products" className="hover:text-oldgold transition">Parfums</Link></li>
            <li><Link to="/cart" className="hover:text-oldgold transition">Panier</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-dark-900 mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>📧 oliafragrance9@gmail.com</li>
            <li>📞 +216 21264085</li>
            <li>📍 TUNIS, Ben Arous</li>
            <li>
              <a href="https://www.instagram.com/oliafragrance" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-oldgold transition">
                @oliafragrance
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center py-4 text-xs text-muted border-t border-white/5">
        © {new Date().getFullYear()} Olia Fragrance. Tous droits réservés.
      </div>
    </footer>
  );
}
