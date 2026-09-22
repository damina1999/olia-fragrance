import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['', 'homme', 'femme', 'unisex', 'enfant'];
const SORTS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, sort, limit: 12 });
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    api.get(`/products?${params}`)
      .then(res => { setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, category, sort, search, minPrice, maxPrice]);

  const update = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif">Nos Parfums <span className="text-gray-400 text-lg font-sans">({total})</span></h1>
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 btn-outline text-sm py-2">
          <FiFilter /> Filtres
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
          <div className="bg-white rounded-2xl shadow p-5 space-y-6 sticky top-24">
            <div>
              <h3 className="font-semibold mb-3">Catégorie</h3>
              {CATEGORIES.map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer py-1">
                  <input type="radio" name="cat" checked={category === c} onChange={() => update('category', c)} className="accent-gold-500" />
                  <span className="text-sm capitalize">{c || 'Toutes'}</span>
                </label>
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-3">Prix (DA)</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => update('minPrice', e.target.value)} className="input-field text-sm py-1.5" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => update('maxPrice', e.target.value)} className="input-field text-sm py-1.5" />
              </div>
            </div>
            <button onClick={() => setSearchParams({})} className="text-sm text-red-500 flex items-center gap-1 hover:underline">
              <FiX size={14} /> Réinitialiser
            </button>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{search && `Résultats pour "${search}"`}</p>
            <select value={sort} onChange={e => update('sort', e.target.value)} className="input-field w-auto text-sm py-2">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p>Aucun parfum trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => update('page', i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-gold-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
