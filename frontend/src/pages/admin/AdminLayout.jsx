import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiMessageSquare, FiImage } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Produits', icon: FiPackage },
  { to: '/admin/orders', label: 'Commandes', icon: FiShoppingBag },
  { to: '/admin/reviews', label: 'Commentaires', icon: FiMessageSquare },
  { to: '/admin/events', label: 'Événements', icon: FiImage },
  { to: '/admin/users', label: 'Utilisateurs', icon: FiUsers },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Olia" className="h-10 w-10 rounded-full object-cover border border-gold-400" />
            <div>
              <h1 className="font-serif text-lg text-gold-400">Olia Fragrance</h1>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive ? 'bg-gold-500 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition w-full"
          >
            <FiLogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
