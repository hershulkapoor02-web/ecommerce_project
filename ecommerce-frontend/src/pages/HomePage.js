import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Zap, Shield, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const API = 'http://localhost:8000/api';

const categories = [
  { slug: 'electronics', label: 'Electronics', emoji: '⚡', color: '#e8f4fd' },
  { slug: 'fashion', label: 'Fashion', emoji: '👗', color: '#fdf0f8' },
  { slug: 'home-living', label: 'Home & Living', emoji: '🏡', color: '#f0fdf4' },
  { slug: 'books', label: 'Books', emoji: '📚', color: '#fdf8f0' },
  { slug: 'sports', label: 'Sports', emoji: '🏃', color: '#f0f4fd' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/products/?featured=true`)
      .then(r => {
        const data = r.data.results || r.data;
        setFeatured(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-blob blob-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <p className="hero-label">New Season Arrivals</p>
            <h1 className="hero-title">
              Curated Finds,<br />
              <em>Exceptional Quality</em>
            </h1>
            <p className="hero-sub">
              Discover handpicked products across electronics, fashion,<br />
              home décor and more — all in one place.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/products')}>
                Shop Now <ArrowRight size={18} />
              </button>
              <button className="btn-ghost" onClick={() => navigate('/products?featured=true')}>
                View Featured
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-stack">
              {featured.slice(0, 3).map((p, i) => (
                <Link key={p.id} to={`/products/${p.slug}`} className={`hero-mini-card hc-${i}`}>
                  <img src={p.image_url} alt={p.name} />
                  <div className="hmc-info">
                    <span>{p.name}</span>
                    <strong>₹{Number(p.effective_price).toLocaleString('en-IN')}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="trust-bar">
        <div className="container trust-inner">
          {[
            { icon: <Truck size={20}/>, label: 'Free Shipping', sub: 'Orders over ₹999' },
            { icon: <Shield size={20}/>, label: 'Secure Payment', sub: '100% protected' },
            { icon: <RefreshCw size={20}/>, label: 'Easy Returns', sub: '30-day policy' },
            { icon: <Zap size={20}/>, label: 'Fast Delivery', sub: '2-5 business days' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="trust-item">
              <div className="trust-icon">{icon}</div>
              <div>
                <p className="trust-label">{label}</p>
                <p className="trust-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Browse Categories</h2>
            <Link to="/products" className="see-all">See all <ArrowRight size={15}/></Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="cat-card" style={{ '--cat-color': cat.color }}>
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products?featured=true" className="see-all">View all <ArrowRight size={15}/></Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Find Your Perfect Match</h2>
            <p>Over 200+ curated products waiting for you</p>
          </div>
          <button className="btn-primary btn-lg" onClick={() => navigate('/products')}>
            Explore All Products <ArrowRight size={18}/>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-mark">◆</span>
            <span className="logo-text">Elara</span>
            <p>Quality products, curated with care.</p>
          </div>
          <div className="footer-links">
            <h4>Shop</h4>
            {categories.map(c => (
              <Link key={c.slug} to={`/products?category=${c.slug}`}>{c.label}</Link>
            ))}
          </div>
          <div className="footer-links">
            <h4>Info</h4>
            <Link to="#">About Us</Link>
            <Link to="#">Contact</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Elara. Built with Django + React.</p>
        </div>
      </footer>
    </div>
  );
}
