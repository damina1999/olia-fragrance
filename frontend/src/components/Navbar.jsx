import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiChevronDown, FiPackage, FiLogOut, FiSettings, FiTag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ isLight = false }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  // Determine if navbar is in light mode display
  // If isLight is true or if explicitly scrolled on light pages, adapt colors
  const useDarkText = isLight;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isLight 
        ? 'bg-white/95 backdrop-blur-xl shadow-md py-3 border-b border-gray-200 text-gray-900' 
        : scrolled 
          ? 'bg-[#0f111a] backdrop-blur-xl shadow-2xl py-2.5 border-b border-gold-500/30 text-white' 
          : 'bg-[#121422] backdrop-blur-md py-3.5 border-b border-white/10 text-white'
    }`}>
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group whitespace-nowrap">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-600 opacity-50 group-hover:opacity-100 blur transition duration-500" />
            <img 
              src="/logo.jpg" 
              alt="Olia Fragrance" 
              className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gold-400/80 transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
          <div>
            <div className={`font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none transition ${
              useDarkText ? 'text-gold-600' : 'text-gold-gradient'
            }`}>
              Olia Fragrance
            </div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-light mt-0.5 ${
              useDarkText ? 'text-gray-500' : 'text-amber-200/70'
            }`}>
              Haute Parfumerie
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un parfum, une note..."
              className={`w-full rounded-full pl-5 pr-11 py-2 text-sm focus:outline-none transition-all duration-300 shadow-inner ${
                useDarkText 
                  ? 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20' 
                  : 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30'
              }`}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gold-500 hover:text-gold-600 hover:scale-110 transition-transform duration-200"
              aria-label="Rechercher"
            >
              <FiSearch size={16} />
            </button>
          </div>
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
          <Link 
            to="/" 
            className={`relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300 ${
              useDarkText ? 'text-gray-900 hover:text-gold-600' : 'text-white hover:text-gold-300'
            }`}
          >
            Accueil
          </Link>
          <Link 
            to="/products" 
            className={`relative py-1 transition-colors flex items-center gap-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300 ${
              useDarkText ? 'text-gray-900 hover:text-gold-600' : 'text-white hover:text-gold-300'
            }`}
          >
            <FiTag className="text-gold-500" size={14} /> Collection
          </Link>

          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="px-3 py-1 bg-gold-500/20 text-gold-600 border border-gold-500/40 rounded-full text-xs font-semibold hover:bg-gold-500/30 transition shadow-sm"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* User Account Dropdown */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                  useDarkText 
                    ? 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-gold-400 to-amber-600 flex items-center justify-center text-dark-950 font-bold text-xs shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
                <FiChevronDown size={14} className={`text-gold-500 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-up z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gold-600 font-semibold">Connecté en tant que</p>
                    <p className="text-sm font-bold truncate text-gray-900">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link 
                      to="/dashboard" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gold-50 text-gray-800 hover:text-gold-700 rounded-xl transition font-medium"
                    >
                      <FiUser size={16} className="text-gold-500" /> Mon compte
                    </Link>
                    <Link 
                      to="/orders" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gold-50 text-gray-800 hover:text-gold-700 rounded-xl transition font-medium"
                    >
                      <FiPackage size={16} className="text-gold-500" /> Mes commandes
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gold-50 text-gray-800 hover:text-gold-700 rounded-xl transition font-medium"
                    >
                      <FiSettings size={16} className="text-gold-500" /> Mon profil
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-gray-100 bg-gray-50">
                    <button 
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
                    >
                      <FiLogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`flex items-center gap-2 text-sm font-bold transition py-2 px-3.5 rounded-full ${
                useDarkText 
                  ? 'text-gray-900 hover:text-gold-600 hover:bg-gray-100' 
                  : 'text-white hover:text-gold-300 hover:bg-white/10'
              }`}
            >
              <FiUser size={18} className="text-gold-500" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className={`relative p-2 transition rounded-full hover:scale-105 ${
              useDarkText ? 'text-gray-900 hover:text-gold-600 hover:bg-gray-100' : 'text-white hover:text-gold-300 hover:bg-white/10'
            }`}
            aria-label="Panier"
          >
            <FiShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gold-500 to-amber-600 text-white font-bold text-[11px] rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            className={`md:hidden p-2 transition ${useDarkText ? 'text-gray-900' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FiX size={26} className="text-gold-500" /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className={`md:hidden border-t px-5 pt-4 pb-6 flex flex-col gap-4 shadow-2xl animate-fade-down ${
          useDarkText ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0f111a] border-gold-500/20 text-white'
        }`}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un parfum..."
              className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none ${
                useDarkText ? 'bg-gray-100 text-gray-900 border border-gray-300' : 'bg-white/10 text-white border border-white/20'
              }`}
            />
            <button type="submit" className="p-2.5 bg-gold-500 text-dark-950 rounded-full font-semibold">
              <FiSearch size={16} />
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-2 text-base font-semibold">
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className={`py-2.5 px-3 rounded-xl transition ${useDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-gray-200'}`}
            >
              Accueil
            </Link>
            <Link 
              to="/products" 
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 hover:bg-gold-500/10 text-gold-600 rounded-xl transition flex items-center gap-3 font-bold"
            >
              <FiTag size={18} /> Tous les parfums
            </Link>
            <Link 
              to="/cart" 
              onClick={() => setMenuOpen(false)}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-between ${useDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-gray-200'}`}
            >
              <span className="flex items-center gap-3"><FiShoppingCart size={18} /> Panier</span>
              {count > 0 && <span className="bg-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>}
            </Link>

            {user ? (
              <>
                <div className="my-2 border-t border-gray-200 opacity-30" />
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`py-2 px-3 text-sm font-medium ${useDarkText ? 'text-gray-700' : 'text-gray-300'}`}>Mon compte</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className={`py-2 px-3 text-sm font-medium ${useDarkText ? 'text-gray-700' : 'text-gray-300'}`}>Mes commandes</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className={`py-2 px-3 text-sm font-medium ${useDarkText ? 'text-gray-700' : 'text-gray-300'}`}>Mon profil</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-2 px-3 text-sm text-gold-600 font-bold">Admin Dashboard</Link>
                )}
                <button 
                  onClick={() => { logout(); setMenuOpen(false); }} 
                  className="mt-2 py-2.5 px-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 font-medium"
                >
                  <FiLogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMenuOpen(false)}
                className="mt-2 py-3 bg-gradient-to-r from-gold-500 to-amber-600 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <FiUser size={18} /> Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
