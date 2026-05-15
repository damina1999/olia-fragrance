import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', oldPrice: '', category: 'homme', brand: '', volume: '', stock: '', isFeatured: false, isActive: true, variants: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = () => {
    api.get(`/admin/products?page=${page}&search=${search}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); })
      .catch(() => {});
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFiles([]); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, price: p.price, oldPrice: p.oldPrice || '', variants: p.variants || [] });
    setFiles([]);
    setShowModal(true);
  };

  // Variants helpers
  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { volume: '', price: '', oldPrice: '', stock: '' }] }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));
  const setVariant = (i, k, v) => setForm(f => {
    const variants = [...f.variants];
    variants[i] = { ...variants[i], [k]: v };
    return { ...f, variants };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const allowed = ['name','description','price','oldPrice','category','brand','volume','stock','isFeatured','isActive'];
      allowed.forEach(k => { if (form[k] !== undefined && form[k] !== '') fd.append(k, form[k]); });
      // Serialize variants
      const cleanVariants = form.variants
        .filter(v => v.volume && v.price)
        .map(v => ({ volume: v.volume, price: Number(v.price), oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined, stock: Number(v.stock) || 0 }));
      fd.append('variants', JSON.stringify(cleanVariants));
      files.forEach(f => fd.append('images', f));

      if (editing) {
        await api.put(`/admin/products/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Produit mis à jour');
      } else {
        await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Produit créé');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Produit supprimé');
      fetchProducts();
    } catch { toast.error('Erreur'); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">Produits ({total})</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> Ajouter
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Produit</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Catégorie</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Prix</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Stock</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Statut</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0] || '/placeholder.jpg'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize">{p.category}</td>
                <td className="px-5 py-3 font-semibold">{p.price.toLocaleString()} DT</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-serif font-bold mb-5">{editing ? 'Modifier' : 'Ajouter'} un produit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Nom du produit" value={form.name} onChange={e => set('name', e.target.value)} className="input-field col-span-2" />
                <input required placeholder="Marque" value={form.brand} onChange={e => set('brand', e.target.value)} className="input-field" />
                <input placeholder="Volume (ex: 100ml)" value={form.volume} onChange={e => set('volume', e.target.value)} className="input-field" />
                <input required type="number" placeholder="Prix (DA)" value={form.price} onChange={e => set('price', e.target.value)} className="input-field" />
                <input type="number" placeholder="Ancien prix (optionnel)" value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} className="input-field" />
                <input required type="number" placeholder="Stock" value={form.stock} onChange={e => set('stock', e.target.value)} className="input-field" />
                <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
                  {['homme', 'femme', 'unisex', 'enfant'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea required placeholder="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="input-field resize-none" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="accent-gold-500" />
                  <span className="text-sm">Produit vedette</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="accent-gold-500" />
                  <span className="text-sm">Actif</span>
                </label>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Images (max 5)</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))} className="input-field" />
                {editing?.images?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {editing.images.map((img, i) => <img key={i} src={img} alt="" className="w-12 h-12 rounded-lg object-cover" />)}
                  </div>
                )}
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Variantes de volume (optionnel)</label>
                  <button type="button" onClick={addVariant} className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1">
                    <FiPlus size={12} /> Ajouter une variante
                  </button>
                </div>
                {form.variants.length > 0 && (
                  <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                    {form.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-4 gap-2 items-center">
                        <input placeholder="Volume (ex: 30ml)" value={v.volume} onChange={e => setVariant(i, 'volume', e.target.value)} className="input-field text-xs py-1.5" />
                        <input type="number" placeholder="Prix DT" value={v.price} onChange={e => setVariant(i, 'price', e.target.value)} className="input-field text-xs py-1.5" />
                        <input type="number" placeholder="Stock" value={v.stock} onChange={e => setVariant(i, 'stock', e.target.value)} className="input-field text-xs py-1.5" />
                        <button type="button" onClick={() => removeVariant(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-1">Si des variantes sont définies, le client choisira parmi elles sur la page produit.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
