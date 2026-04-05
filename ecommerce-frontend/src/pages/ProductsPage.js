import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const API = 'http://localhost:8000/api';

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';

  useEffect(() => {
    axios.get(`${API}/categories/`).then(r => {
      const data = r.data.results || r.data;
      setCategories(Array.isArray(data) ? data : []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (featured) params.featured = featured;
    if (priceRange.min) params.min_price = priceRange.min;
    if (priceRange.max) params.max_price = priceRange.max;

    axios.get(`${API}/products/`, { params })
      .then(r => {
        let data = r.data.results || r.data;
        if (sort === 'price_asc') data = [...data].sort((a, b) => a.effective_price - b.effective_price);
        if (sort === 'price_desc') data = [...data].sort((a, b) => b.effective_price - a.effective_price);
        if (sort === 'name') data = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setProducts(data);
        setTotal(r.data.count || data.length);
      })
      .finally(() => setLoading(false));
  }, [category, search, featured, sort, priceRange]);

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange({ min: '', max: '' });
    setSort('');
  };

  const activeCategory = categories.find(c => c.slug === category);

  return (
    <div className="products-page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {search ? `Results for "${search}"` : activeCategory ? activeCategory.name : featured ? 'Featured Products' : 'All Products'}
            </h1>
            <p className="page-count">{total} product{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="page-actions">
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
              {(category || priceRange.min || priceRange.max) && <span className="filter-dot" />}
            </button>
            <div className="sort-wrap">
              <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="sort-chevron" />
            </div>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">Clear all</button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <button
                  className={`filter-chip ${!category ? 'active' : ''}`}
                  onClick={() => setSearchParams({})}
                >All</button>
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    className={`filter-chip ${category === cat.slug ? 'active' : ''}`}
                    onClick={() => setSearchParams({ category: cat.slug })}
                  >
                    {cat.name}
                    <span className="chip-count">{cat.product_count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range (₹)</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                  className="price-input"
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                  className="price-input"
                />
              </div>
            </div>

            <button className="btn-mobile-close" onClick={() => setShowFilters(false)}>
              <X size={16}/> Close Filters
            </button>
          </aside>

          {/* Products */}
          <div className="products-main">
            {loading ? (
              <div className="products-grid">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
