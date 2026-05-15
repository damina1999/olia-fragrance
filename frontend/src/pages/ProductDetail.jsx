import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiThumbsDown, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data);
      if (r.data.variants?.length > 0) setSelectedVariant(r.data.variants[0]);
    }).catch(() => {});
    api.get(`/reviews/product/${id}`).then(r => setReviews(r.data)).catch(() => {});
  }, [id]);

  // Computed price based on selected variant
  const displayPrice = selectedVariant ? selectedVariant.price : product?.price;
  const displayOldPrice = selectedVariant ? selectedVariant.oldPrice : product?.oldPrice;
  const displayStock = selectedVariant ? selectedVariant.stock : product?.stock;

  const handleLike = async () => {
    if (!user) return toast.error('Connectez-vous');
    const { data } = await api.post(`/products/${id}/like`);
    setProduct(p => ({ ...p, likes: Array(data.likes).fill(null), dislikes: Array(data.dislikes).fill(null) }));
  };

  const handleDislike = async () => {
    if (!user) return toast.error('Connectez-vous');
    const { data } = await api.post(`/products/${id}/dislike`);
    setProduct(p => ({ ...p, likes: Array(data.likes).fill(null), dislikes: Array(data.dislikes).fill(null) }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Connectez-vous pour laisser un avis');
    if (!newReview.comment.trim()) return toast.error('Écrivez un commentaire');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/reviews/product/${id}`, newReview);
      setReviews(prev => [data, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Avis ajouté');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square mb-3">
            <img src={product.images?.[activeImg] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${activeImg === i ? 'border-gold-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-gold-500 font-medium uppercase tracking-wide text-sm">{product.brand}</p>
          <h1 className="text-3xl font-serif font-bold mt-1 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating value={product.avgRating} readonly />
            <span className="text-gray-500 text-sm">{product.avgRating} ({product.reviewCount} avis)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">{displayPrice?.toLocaleString()} DT</span>
            {displayOldPrice && <span className="text-xl text-gray-400 line-through">{displayOldPrice?.toLocaleString()} DT</span>}
          </div>

          <p className="text-gray-600 leading-relaxed mb-5">{product.description}</p>

          {/* Variants selector */}
          {product.variants?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Choisir le volume :</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedVariant(v); setQty(1); }}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${
                      selectedVariant?.volume === v.volume
                        ? 'border-gold-500 bg-gold-50 text-gold-700'
                        : 'border-gray-200 hover:border-gold-300 text-gray-600'
                    } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={v.stock === 0}
                  >
                    {v.volume}
                    <span className="block text-xs font-bold mt-0.5">{v.price.toLocaleString()} DT</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span className="bg-gray-100 px-3 py-1 rounded-full capitalize">{product.category}</span>
            {!product.variants?.length && product.volume && <span className="bg-gray-100 px-3 py-1 rounded-full">{product.volume}</span>}
            <span className={`px-3 py-1 rounded-full ${displayStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {displayStock > 0 ? `En stock (${displayStock})` : 'Rupture de stock'}
            </span>
          </div>

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition"><FiMinus /></button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button onClick={() => setQty(q => Math.min(displayStock, q + 1))} className="px-3 py-2 hover:bg-gray-100 transition"><FiPlus /></button>
            </div>
            <button
              disabled={displayStock === 0}
              onClick={() => {
                const cartItem = selectedVariant
                  ? { ...product, price: selectedVariant.price, volume: selectedVariant.volume, _id: `${product._id}_${selectedVariant.volume}`, productId: product._id }
                  : product;
                addToCart(cartItem, qty);
                toast.success('Ajouté au panier');
              }}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FiShoppingCart /> Ajouter au panier
            </button>
          </div>

          {/* Like / Dislike */}
          <div className="flex gap-3">
            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition text-sm">
              <FiHeart /> {product.likes?.length || 0} J'aime
            </button>
            <button onClick={handleDislike} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm">
              <FiThumbsDown /> {product.dislikes?.length || 0}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <h2 className="text-2xl font-serif mb-6">Avis clients</h2>

        {/* Add review form */}
        {user && (
          <form onSubmit={submitReview} className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Laisser un avis</h3>
            <div className="mb-3">
              <label className="text-sm text-gray-600 mb-1 block">Note</label>
              <StarRating value={newReview.rating} onChange={r => setNewReview(p => ({ ...p, rating: r }))} />
            </div>
            <textarea
              value={newReview.comment}
              onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))}
              placeholder="Partagez votre expérience..."
              rows={3}
              className="input-field resize-none mb-3"
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Envoi...' : 'Publier'}
            </button>
          </form>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Aucun avis pour ce produit</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center font-semibold text-gold-600">
                    {r.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{r.user?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="ml-auto">
                    <StarRating value={r.rating} readonly size={14} />
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
