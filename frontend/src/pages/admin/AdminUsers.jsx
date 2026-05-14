import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'client' : 'admin';
    if (!confirm(`Changer le rôle de ${user.name} en ${newRole} ?`)) return;
    try {
      const { data } = await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === user._id ? data : u));
      toast.success('Rôle mis à jour');
    } catch { toast.error('Erreur'); }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif font-bold mb-6">Utilisateurs ({users.length})</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Utilisateur</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Contact</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Méthode</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Rôle</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Inscrit le</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-semibold">
                      {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{u.email || u.phone || '—'}</td>
                <td className="px-5 py-3">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs capitalize">{u.provider}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-gold-100 text-gold-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleRole(u)} className="text-xs text-blue-500 hover:underline">
                    {u.role === 'admin' ? 'Rétrograder' : 'Promouvoir admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
