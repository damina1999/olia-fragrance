import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-dark-900/72 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 whitespace-nowrap">
          <img src="/logo.jpg" alt="Olia Fragrance" className="h-14 w-14 rounded-full object-cover border-2 border-gold-400/40 shadow-lg" />
          <div className="hidden sm:block">
            <div className="font-serif text-[1.4rem] text-gold-300 leading-none">Olia Fragrance</div>
            <div className="text-xs text-white/60 tracking-wide">The Essence of Beauty</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un parfum..."
              className="w-full bg-white/90 border border-transparent rounded-full px-5 py-2.5 text-sm text-dark-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-300"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 hover:text-gold-600 transition">
              <FiSearch />
            </button>
          </div>
        </form>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
          <Link to="/products" className="hover:text-gold-300 transition">Parfums</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-gold-300 transition">Admin</Link>
              )}
              <div className="relative group">
                <button className="hover:text-gold-300 transition flex items-center gap-1">
                  <FiUser size={16} /> {user.name}
                </button>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/dashboard" className="block px-4 py-2.5 text-sm hover:bg-gray-50 rounded-t-xl">Mon compte</Link>
                  <Link to="/orders" className="block px-4 py-2.5 text-sm hover:bg-gray-50">Mes commandes</Link>
                  <Link to="/profile" className="block px-4 py-2.5 text-sm hover:bg-gray-50">Mon profil</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-b-xl">Déconnexion</button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="hover:text-gold-300 transition flex items-center gap-1">
              <FiUser size={16} /> Connexion
            </Link>
          )}
          <Link to="/cart" className="relative hover:text-gold-300 transition">
            <FiShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-dark-900 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur px-4 pb-4 flex flex-col gap-3 text-sm text-white border-t border-white/10">
          <form onSubmit={handleSearch} className="flex gap-2 mt-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 bg-white/95 rounded-full px-4 py-2 text-dark-900 placeholder-gray-500 focus:outline-none"
            />
            <button type="submit" className="text-gold-300"><FiSearch /></button>
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Parfums</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Panier ({count})</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Mon compte</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>Mes commandes</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Mon profil</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-400">Déconnexion</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
          )}
        </div>
      )}
    </nav>
  );
}
