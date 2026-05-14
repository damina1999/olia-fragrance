import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};
const STATUS_LABELS = {
  pending: 'En attente', confirmed: 'Confirmée', processing: 'En traitement',
  shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = () => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (filter) params.set('status', filter);
    api.get(`/admin/orders?${params}`).then(r => { setOrders(r.data.orders); setTotal(r.data.total); }).catch(() => {});
  };

  useEffect(() => { fetchOrders(); }, [page, filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Statut mis à jour');
      fetchOrders();
    } catch { toast.error('Erreur'); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">Commandes ({total})</h1>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">Tous les statuts</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Client</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Paiement</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Statut</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <>
                <tr key={o._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                  <td className="px-5 py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{o.user?.name}</p>
                    <p className="text-gray-400 text-xs">{o.user?.email || o.user?.phone}</p>
                  </td>
                  <td className="px-5 py-3 font-bold">{o.totalPrice?.toLocaleString()} DT</td>
                  <td className="px-5 py-3 capitalize">{o.paymentMethod}</td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${STATUS_COLORS[o.status]}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{expanded === o._id ? '▲' : '▼'}</td>
                </tr>
                {expanded === o._id && (
                  <tr key={`${o._id}-detail`}>
                    <td colSpan={7} className="px-5 py-4 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Articles</p>
                          {o.items?.map((item, i) => (
                            <div key={i} className="flex justify-between py-1 border-b border-gray-100">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">{(item.price * item.quantity).toLocaleString()} DT</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Livraison</p>
                          <p>{o.shippingAddress?.fullName}</p>
                          <p className="text-gray-500">{o.shippingAddress?.address}, {o.shippingAddress?.city}</p>
                          <p className="text-gray-500">{o.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
