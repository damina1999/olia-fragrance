import { useEffect, useState } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../api/axios';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const STATUS_COLORS = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#6366f1', delivered: '#10b981', cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
    </div>
  );

  const cards = [
    { label: 'Produits', value: stats?.totalProducts, icon: FiPackage, color: 'bg-blue-500' },
    { label: 'Commandes', value: stats?.totalOrders, icon: FiShoppingBag, color: 'bg-purple-500' },
    { label: 'Clients', value: stats?.totalUsers, icon: FiUsers, color: 'bg-green-500' },
    { label: 'Revenus', value: `${stats?.totalRevenue?.toLocaleString()} DT`, icon: FiDollarSign, color: 'bg-gold-500' },
  ];

  const chartData = stats?.monthlyRevenue?.map(d => ({
    name: MONTHS[d._id.month - 1],
    revenus: d.revenue,
    commandes: d.orders,
  })) || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif font-bold mb-8">Tableau de bord</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${card.color} text-white p-3 rounded-xl`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">Revenus mensuels</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v.toLocaleString()} DT`} />
              <Bar dataKey="revenus" fill="#c49a2e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">Statut des commandes</h2>
          <div className="space-y-3">
            {stats?.ordersByStatus?.map(s => (
              <div key={s._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: STATUS_COLORS[s._id] || '#999' }} />
                  <span className="text-sm capitalize">{s._id}</span>
                </div>
                <span className="font-semibold text-sm">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="text-left pb-3">ID</th>
                <th className="text-left pb-3">Client</th>
                <th className="text-left pb-3">Montant</th>
                <th className="text-left pb-3">Statut</th>
                <th className="text-left pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats?.recentOrders?.map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3">{o.user?.name}</td>
                  <td className="py-3 font-semibold">{o.totalPrice?.toLocaleString()} DT</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status] }}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
