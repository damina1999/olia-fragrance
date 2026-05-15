import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: 'Tunisia', phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const shipping = total >= 100 ? 0 : 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Panier vide');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cart.map(i => ({
          product: i._id,
          quantity: i.quantity,
          price: i.price,
          volume: i.variantVolume || i.volume || '',
          name: i.name,
        })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      toast.success('Commande passée avec succès !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-8">Finaliser la commande</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        {/* Shipping */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Adresse de livraison</h2>
          <input required placeholder="Nom complet" value={form.fullName} onChange={e => set('fullName', e.target.value)} className="input-field" />
          <input required placeholder="Adresse" value={form.address} onChange={e => set('address', e.target.value)} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Ville" value={form.city} onChange={e => set('city', e.target.value)} className="input-field" />
            <input placeholder="Code postal" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} className="input-field" />
          </div>
          <input required placeholder="Téléphone" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" />

          <h2 className="font-semibold text-lg pt-2">Mode de paiement</h2>
          {[
            { value: 'cash', label: '💵 Paiement à la livraison' },
            // { value: 'card', label: '💳 Carte bancaire' },
            // { value: 'paypal', label: '🅿️ PayPal' },
          ].map(m => (
            <label key={m.value} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:border-gold-400 transition">
              <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="accent-gold-500" />
              <span>{m.label}</span>
            </label>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Votre commande</h2>
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-4">
            {cart.map(item => {
              const key = item.cartKey || `${item._id}_${item.variantVolume || item.volume || 'default'}`;
              return (
              <div key={key} className="flex justify-between text-sm">
                <span>{item.name} {item.variantVolume || item.volume ? `(${item.variantVolume || item.volume})` : ''} × {item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()} DT</span>
              </div>
              );
            })}
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Sous-total</span><span>{total.toLocaleString()} DT</span></div>
              <div className="flex justify-between"><span>Livraison</span><span>{shipping === 0 ? 'Gratuite' : `${shipping} DT`}</span></div>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span>{(total + shipping).toLocaleString()} DT</span>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Traitement...' : 'Confirmer la commande'}
          </button>
        </div>
      </form>
    </div>
  );
}
