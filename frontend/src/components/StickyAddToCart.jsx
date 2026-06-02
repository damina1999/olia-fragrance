import { FiMinus, FiPlus } from 'react-icons/fi';

export default function StickyAddToCart({ product, selectedVariant, qty, setQty, handleAddToCart, currentPrice, currentStock, hasVariants }) {
  const label = selectedVariant?.volume || product?.volume || '';
  const disabled = currentStock <= 0;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t shadow-lg md:hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={product?.images?.[0] || '/placeholder.jpg'} alt={product?.name} className="w-12 h-12 object-cover rounded-md" />
          <div>
            <div className="text-sm font-medium">{product?.brand}</div>
            <div className="text-sm text-gray-700">{product?.name} <span className="text-xs text-gray-500">{label}</span></div>
            <div className="text-sm font-bold mt-1">{currentPrice?.toLocaleString()} DT</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2"><FiMinus /></button>
            <div className="px-3">{qty}</div>
            <button onClick={() => setQty(qty + 1)} className="px-3 py-2"><FiPlus /></button>
          </div>
          <button onClick={handleAddToCart} disabled={disabled} className={`px-4 py-2 rounded-lg text-white ${disabled ? 'bg-gray-400' : 'bg-gradient-to-r from-gold-500 to-gold-700'}`}>
            {disabled ? 'Rupture' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}
