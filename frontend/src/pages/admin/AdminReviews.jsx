import { useEffect, useState } from 'react';
import { FiTrash2, FiSearch, FiStar } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchReviews = () => {
    api.get(`/admin/reviews?page=${page}&limit=${limit}&search=${search}`)
      .then(r => { setReviews(r.data.reviews); setTotal(r.data.total); })
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet avis ?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('Avis supprime');
      fetchReviews();
    } catch { toast.error('Erreur'); }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif font-bold mb-6">Commentaires ({total})</h1>
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Rechercher..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-9" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Client</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Produit</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Note</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Commentaire</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun commentaire</td></tr>
            ) : reviews.map(r => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <p className="font-medium">{r.user?.name}</p>
                  <p className="text-gray-400 text-xs">{r.user?.email}</p>
                </td>
                <td className="px-5 py-3 text-xs font-medium">{r.product?.name}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 max-w-xs">
                  <p className="text-gray-700 text-xs line-clamp-2">{r.comment}</p>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-5 py-3">
                  <button onClick={() => handleDelete(r._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition">
                    <FiTrash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
