import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: 'Tunisia', phone: '',
  });
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const shipping = total >= 100 ? 0 : 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Panier vide');

    // Guest validation
    if (!user && !guestEmail && !guestPhone) {
      return toast.error('Veuillez entrer votre email ou téléphone');
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map(i => ({
          product: i._id,
          quantity: i.quantity,
          price: i.price,
          volume: i.variantVolume || i.volume || '',
          name: i.name,
        })),
        shippingAddress: form,
        paymentMethod,
      };

      // Add guest info if not logged in
      if (!user) {
        if (guestEmail) payload.guestEmail = guestEmail;
        if (guestPhone) payload.guestPhone = guestPhone;
      }

      const { data } = await api.post('/orders', payload);
      clearCart();
      toast.success('Commande passée avec succès !');
      navigate(`/order-confirmation/${data._id}`);
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
          {/* Guest info section */}
          {!user && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-600"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                <h2 className="font-semibold text-lg text-amber-800">Vos coordonnées</h2>
              </div>
              <p className="text-xs text-amber-700 mb-2">Pas besoin de créer un compte ! Entrez juste vos coordonnées pour suivre votre commande.</p>
              <input
                required
                type="email"
                placeholder="Email *"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                className="input-field"
              />
              <input
                placeholder="Téléphone (optionnel)"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                className="input-field"
              />
            </div>
          )}

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
              <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span>Livraison</span><span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span></div>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span>{formatPrice(total + shipping)}</span>
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
