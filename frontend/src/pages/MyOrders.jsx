import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
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

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = () => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => setError('Impossible de charger vos commandes'))
      .finally(() => setLoading(false));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
          <Link to="/profile" className="text-sm text-amber-600 hover:text-amber-700">Mon profil →</Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Vous n'avez pas encore de commandes.</p>
            <Link to="/products" className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition">
              Découvrir nos parfums
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Commande #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div className="divide-y divide-gray-50">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name || 'Produit'}</p>
                        <p className="text-xs text-gray-500">{item.volume && `${item.volume} · `}Qté : {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </p>
                  <p className="font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
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
    </div>
  );
}
