import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
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

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/guest/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => toast.error('Commande introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  const canCancel = () => {
    if (!order) return false;
    if (!['pending', 'confirmed'].includes(order.status)) return false;
    const hoursSince = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSince < 12;
  };

  const timeLeftToCancel = () => {
    if (!order) return '';
    const msLeft = 12 * 60 * 60 * 1000 - (Date.now() - new Date(order.createdAt).getTime());
    if (msLeft <= 0) return '';
    const hours = Math.floor(msLeft / (1000 * 60 * 60));
    const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  const handleCancel = async () => {
    if (!window.confirm('Voulez-vous vraiment annuler cette commande ?')) return;
    setCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      toast.success('Commande annulée avec succès');
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'annulation');
    } finally {
      setCancelling(false);
    }
  };

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien de suivi copié !');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <p className="text-xl mb-4">Commande introuvable</p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  const shipping = order.totalPrice >= 100 ? 0 : 8;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10 text-green-600">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-500">Merci pour votre commande. Voici le récapitulatif.</p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Order header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Commande</p>
                <p className="font-mono font-bold text-lg text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Items */}
          <div className="px-6 py-4 divide-y divide-gray-50">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.volume && `${item.volume} · `}Qté : {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-gray-50 px-6 py-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Sous-total</span><span>{formatPrice(order.totalPrice)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Livraison</span><span>{shipping === 0 ? <span className="text-green-600">Gratuite</span> : formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>Total</span><span className="text-amber-700">{formatPrice(order.totalPrice + shipping)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Adresse de livraison</p>
            <p className="text-sm font-medium">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress?.address}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress?.city}{order.shippingAddress?.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {/* Cancel button */}
          {canCancel() && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Annuler la commande</p>
                  <p className="text-xs text-gray-500">Temps restant : {timeLeftToCancel()}</p>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition disabled:opacity-50"
                >
                  {cancelling ? 'Annulation...' : 'Annuler'}
                </button>
              </div>
            </div>
          )}

          {/* Copy tracking link */}
          <button
            onClick={copyTrackingLink}
            className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copier le lien de suivi
          </button>

          <Link to="/products" className="block w-full text-center btn-primary py-3">
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}
