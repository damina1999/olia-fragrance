import { useEffect, useState } from 'react';
import { FiPrinter } from 'react-icons/fi';
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

function printDeliverySlip(order) {
  const shipping = order.totalPrice >= 100 ? 0 : 8;
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8"/>
      <title>Bon de livraison #${order._id.slice(-8).toUpperCase()}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a1a; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #c9a84c; padding-bottom: 16px; margin-bottom: 20px; }
        .logo-section h1 { font-size: 22px; color: #c9a84c; font-family: Georgia, serif; }
        .logo-section p { font-size: 11px; color: #888; margin-top: 2px; }
        .slip-title { text-align: right; }
        .slip-title h2 { font-size: 18px; font-weight: bold; }
        .slip-title p { font-size: 11px; color: #666; margin-top: 4px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; }
        .box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 8px; border-bottom: 1px solid #f0f0f0; padding-bottom: 6px; }
        .box p { margin-bottom: 4px; line-height: 1.5; }
        .box .label { color: #888; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th { background: #f9f9f9; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; color: #888; border-bottom: 1px solid #e5e7eb; }
        td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
        .totals { margin-left: auto; width: 260px; }
        .totals tr td { border: none; padding: 4px 10px; }
        .totals .total-row td { font-weight: bold; font-size: 15px; border-top: 2px solid #c9a84c; padding-top: 8px; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; background: #fef3c7; color: #92400e; }
        .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 14px; text-align: center; font-size: 11px; color: #aaa; }
        .barcode { text-align: center; margin: 16px 0; font-family: monospace; font-size: 11px; color: #888; letter-spacing: 3px; }
        @media print { body { padding: 15px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          <h1>Olia Fragrance</h1>
          <p>The Essence of Beauty</p>
          <p style="margin-top:6px">oliafragrance9@gmail.com | +216 21264085</p>
          <p>TUNIS, Ben Arous</p>
        </div>
        <div class="slip-title">
          <h2>BON DE LIVRAISON</h2>
          <p>N° <strong>#${order._id.slice(-8).toUpperCase()}</strong></p>
          <p>Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p style="margin-top:8px"><span class="status-badge">${STATUS_LABELS[order.status] || order.status}</span></p>
        </div>
      </div>

      <div class="grid">
        <div class="box">
          <h3>Informations client</h3>
          <p><strong>${order.user?.name || '—'}</strong></p>
          <p class="label">Email</p><p>${order.user?.email || '—'}</p>
          <p class="label">Téléphone</p><p>${order.user?.phone || order.shippingAddress?.phone || '—'}</p>
        </div>
        <div class="box">
          <h3>Adresse de livraison</h3>
          <p><strong>${order.shippingAddress?.fullName || '—'}</strong></p>
          <p>${order.shippingAddress?.address || '—'}</p>
          <p>${order.shippingAddress?.city || ''}${order.shippingAddress?.postalCode ? ' ' + order.shippingAddress.postalCode : ''}</p>
          <p>${order.shippingAddress?.country || 'Tunisie'}</p>
          <p class="label" style="margin-top:6px">Téléphone</p>
          <p>${order.shippingAddress?.phone || '—'}</p>
        </div>
      </div>

      <div class="box" style="margin-bottom:20px">
        <h3>Détail de la commande</h3>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Volume</th>
              <th style="text-align:center">Qté</th>
              <th style="text-align:right">Prix unitaire</th>
              <th style="text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>${item.name || item.product?.name || '—'}</td>
                <td>${item.volume || item.variantVolume || '—'}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">${Number(item.price).toLocaleString('fr-FR')} DT</td>
                <td style="text-align:right"><strong>${(item.price * item.quantity).toLocaleString('fr-FR')} DT</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <table class="totals">
          <tr><td>Sous-total</td><td style="text-align:right">${order.totalPrice?.toLocaleString('fr-FR')} DT</td></tr>
          <tr><td>Livraison</td><td style="text-align:right">${shipping === 0 ? '<span style="color:green">Gratuite</span>' : shipping + ' DT'}</td></tr>
          <tr class="total-row"><td>TOTAL</td><td style="text-align:right;color:#c9a84c">${(order.totalPrice + shipping).toLocaleString('fr-FR')} DT</td></tr>
        </table>
      </div>

      <div class="grid">
        <div class="box">
          <h3>Mode de paiement</h3>
          <p style="text-transform:capitalize;font-weight:bold">${order.paymentMethod === 'cash' ? '💵 Paiement à la livraison' : order.paymentMethod}</p>
        </div>
        <div class="box">
          <h3>Instructions</h3>
          <p>Vérifier l'état du colis avant signature.</p>
          <p style="margin-top:4px">Signature du client : ___________________</p>
        </div>
      </div>

      <div class="barcode">
        |||  ${order._id}  |||
      </div>

      <div class="footer">
        <p>Merci pour votre confiance — Olia Fragrance © ${new Date().getFullYear()}</p>
        <p>Document généré le ${new Date().toLocaleString('fr-FR')}</p>
      </div>

      <script>window.onload = () => window.print();</script>
    </body>
    </html>
  `;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

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
                  <td className="px-5 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); printDeliverySlip(o); }}
                      title="Imprimer bon de livraison"
                      className="p-2 hover:bg-gold-50 text-gold-600 rounded-lg transition flex items-center gap-1 text-xs font-medium"
                    >
                      <FiPrinter size={15} /> Bon
                    </button>
                  </td>
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
