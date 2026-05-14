import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiThumbsDown, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [likes, setLikes] = useState(product.likes?.length || 0);
  const [dislikes, setDislikes] = useState(product.dislikes?.length || 0);
  const [liked, setLiked] = useState(product.likes?.includes(user?._id));
  const [disliked, setDisliked] = useState(product.dislikes?.includes(user?._id));

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Connectez-vous pour liker');
    try {
      const { data } = await api.post(`/products/${product._id}/like`);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLiked(data.liked);
      if (data.liked) setDisliked(false);
    } catch { toast.error('Erreur'); }
  };

  const handleDislike = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Connectez-vous');
    try {
      const { data } = await api.post(`/products/${product._id}/dislike`);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setDisliked(data.disliked);
      if (data.disliked) setLiked(false);
    } catch { toast.error('Erreur'); }
  };

  return (
    <Link to={`/products/${product._id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
            Vedette
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gold-500 font-medium uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-serif text-gray-900 font-semibold mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{product.volume} · {product.category}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[1,2,3,4,5].map(s => (
            <FiStar key={s} size={12} className={s <= Math.round(product.avgRating) ? 'text-gold-400 fill-gold-400' : 'text-gray-300'} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price + actions */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()} DT</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">{product.oldPrice.toLocaleString()} DT</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); toast.success('Ajouté au panier'); }}
            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
          >
            <FiShoppingCart size={14} /> Ajouter
          </button>
          <button onClick={handleLike} className={`p-2 rounded-lg border transition ${liked ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'}`}>
            <FiHeart size={16} />
          </button>
          <button onClick={handleDislike} className={`p-2 rounded-lg border transition ${disliked ? 'bg-gray-100 border-gray-400 text-gray-700' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
            <FiThumbsDown size={16} />
          </button>
        </div>

        <div className="flex gap-3 mt-2 text-xs text-gray-400">
          <span>❤️ {likes}</span>
          <span>👎 {dislikes}</span>
        </div>
      </div>
    </Link>
  );
}
