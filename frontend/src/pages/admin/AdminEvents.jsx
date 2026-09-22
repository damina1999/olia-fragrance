import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const empty = { title: '', description: '', link: '', isActive: true, order: 0 };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetch = () => api.get('/admin/events').then(r => setEvents(r.data)).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setImageFile(null);
    setImagePreview('');
    setModal(true);
  };

  const openEdit = (ev) => {
    setEditing(ev._id);
    setForm({ title: ev.title, description: ev.description, link: ev.link, isActive: ev.isActive, order: ev.order });
    setImageFile(null);
    setImagePreview(ev.image || '');
    setModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('link', form.link);
      fd.append('isActive', form.isActive);
      fd.append('order', form.order);
      if (imageFile) fd.append('images', imageFile);

      if (editing) {
        await api.put(`/admin/events/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Événement mis à jour');
      } else {
        await api.post('/admin/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Événement créé');
      }
      setModal(false);
      fetch();
    } catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet événement ?')) return;
    await api.delete(`/admin/events/${id}`);
    toast.success('Supprimé');
    fetch();
  };

  const toggleActive = async (ev) => {
    const fd = new FormData();
    fd.append('title', ev.title);
    fd.append('description', ev.description);
    fd.append('link', ev.link || '');
    fd.append('isActive', !ev.isActive);
    fd.append('order', ev.order);
    await api.put(`/admin/events/${ev._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    fetch();
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">Événements / Carousel</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Image</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Titre</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Description</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Ordre</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Statut</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun événement. Créez-en un !</td></tr>
            ) : events.map(ev => (
              <tr key={ev._id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  {ev.image ? (
                    <img src={ev.image} alt={ev.title} className="w-16 h-10 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">No img</div>
                  )}
                </td>
                <td className="px-5 py-3 font-medium">{ev.title}</td>
                <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{ev.description}</td>
                <td className="px-5 py-3 text-gray-500">{ev.order}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(ev)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition ${ev.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {ev.isActive ? <><FiEye size={11} /> Actif</> : <><FiEyeOff size={11} /> Inactif</>}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(ev)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition"><FiEdit2 size={15} /></button>
                    <button onClick={() => handleDelete(ev._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"><FiTrash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-serif font-bold mb-5">{editing ? 'Modifier' : 'Nouvel'} événement</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Titre *</label>
                <input required value={form.title} onChange={e => set('title', e.target.value)} className="input-field" placeholder="Ex: Soldes d'été -30%" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" rows={3} placeholder="Description de l'événement..." />
              </div>

              {/* Image upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image du carousel</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gold-400 hover:bg-gold-50 transition overflow-hidden relative">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition rounded-xl">
                        <span className="text-white text-sm font-medium">Changer l'image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Cliquer pour importer une image</span>
                      <span className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Lien (optionnel)</label>
                <input value={form.link} onChange={e => set('link', e.target.value)} className="input-field" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Ordre d'affichage</label>
                  <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className="input-field" min={0} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-gold-500" />
                    <span className="text-sm font-medium text-gray-700">Actif</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
