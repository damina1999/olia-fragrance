import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
      <FiShoppingBag size={64} className="mb-4 opacity-30" />
      <h2 className="text-2xl font-serif mb-2">Votre panier est vide</h2>
      <p className="mb-6">Découvrez nos parfums et ajoutez-en à votre panier</p>
      <Link to="/products" className="btn-primary">Explorer la boutique</Link>
    </div>
  );

  const shipping = total >= 100 ? 0 : 8;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-8">Mon Panier</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="card flex gap-4 p-4">
              <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="text-xs text-gold-500 font-medium">{item.brand}</p>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.volume}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100"><FiMinus size={14} /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100"><FiPlus size={14} /></button>
                  </div>
                  <span className="font-bold">{(item.price * item.quantity).toLocaleString()} DT</span>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 transition">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="font-serif text-xl mb-4">Récapitulatif</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span>Sous-total</span><span>{total.toLocaleString()} DT</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>{shipping === 0 ? <span className="text-green-600">Gratuite</span> : `${shipping} DT`}</span></div>
            {shipping > 0 && <p className="text-xs text-gray-400">Livraison gratuite dès 100 DT</p>}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg mb-5">
            <span>Total</span><span>{(total + shipping).toLocaleString()} DT</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center block">
            Passer la commande
          </Link>
          <Link to="/products" className="btn-outline w-full text-center block mt-3 text-sm">
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}
