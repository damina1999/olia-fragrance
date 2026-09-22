import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiPackage, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement',
  shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
};

function canCancel(order) {
  if (!['pending', 'confirmed'].includes(order.status)) return false;
  const hoursSince = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
  return hoursSince < 12;
}

function timeLeftToCancel(order) {
  const msLeft = 12 * 60 * 60 * 1000 - (Date.now() - new Date(order.createdAt).getTime());
  if (msLeft <= 0) return '';
  const hours = Math.floor(msLeft / (1000 * 60 * 60));
  const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}min`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = () => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette commande ?')) return;
    setCancellingId(orderId);
    try {
      await api.post(`/orders/${orderId}/cancel`);
      toast.success('Commande annulée avec succès');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'annulation');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-8">Mon Espace</h1>

      {/* Profile card */}
      <div className="card p-6 flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center text-2xl font-bold text-gold-600">
          {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email || user?.phone}</p>
          <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.provider}</span>
        </div>
      </div>

      {/* Orders */}
      <h2 className="text-xl font-serif mb-4 flex items-center gap-2"><FiPackage /> Mes Commandes ({orders.length})</h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FiPackage size={48} className="mx-auto mb-3 opacity-30" />
          <p>Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-sm">Commande #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {order.items.map((item, i) => (
                  <div key={i} className="text-xs bg-gray-50 rounded-lg px-2 py-1">
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{order.paymentMethod === 'cash' ? '💵 Paiement à la livraison' : '💳 Carte'}</span>
                <span className="font-bold">{formatPrice(order.totalPrice)}</span>
              </div>

              {/* Cancel button */}
              {canCancel(order) && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    ⏱ Annulation possible encore {timeLeftToCancel(order)}
                  </p>
                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={cancellingId === order._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <FiX size={14} />
                    {cancellingId === order._id ? 'Annulation...' : 'Annuler'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
