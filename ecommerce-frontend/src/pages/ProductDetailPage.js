import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Star, Shield, Truck, Package, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const API = 'http://localhost:8000/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${slug}/`)
      .then(r => {
        setProduct(r.data);
        return axios.get(`${API}/products/?category=${r.data.category}`);
      })
      .then(r => setRelated((r.data.results || r.data).filter(p => p.slug !== slug).slice(0, 4)))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return (
    <div className="detail-loading container">
      <div className="detail-skeleton" />
    </div>
  );

  if (!product) return null;

  const rating = (4 + (product.id % 10) * 0.1).toFixed(1);
  const reviews = 40 + (product.id * 17) % 200;

  return (
    <div className="detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category_name}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-wrap">
            {product.discount_percent > 0 && (
              <span className="detail-badge">-{product.discount_percent}% OFF</span>
            )}
            <img
              src={product.image_url || `https://via.placeholder.com/600x500?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              className="detail-img"
            />
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-category">{product.category_name}</span>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16}
                  fill={i < Math.floor(rating) ? 'var(--gold)' : 'none'}
                  stroke="var(--gold)"
                />
              ))}
              <span className="rating-val">{rating}</span>
              <span className="rating-reviews">({reviews} reviews)</span>
            </div>

            <div className="detail-price">
              <span className="price-main">₹{Number(product.effective_price).toLocaleString('en-IN')}</span>
              {product.sale_price && (
                <>
                  <span className="price-orig">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  <span className="price-save">Save {product.discount_percent}%</span>
                </>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            <div className="stock-info">
              <div className={`stock-dot ${product.stock > 10 ? 'in' : product.stock > 0 ? 'low' : 'out'}`} />
              <span>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty + Add */}
            <div className="detail-actions">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16}/></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={16}/></button>
              </div>
              <button
                className="detail-add-btn"
                onClick={() => addToCart(product.id, qty)}
                disabled={cartLoading || product.stock === 0}
              >
                <ShoppingCart size={18}/>
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            <Link to="/cart" className="buy-now-btn">Buy Now →</Link>

            {/* Perks */}
            <div className="detail-perks">
              {[
                { icon: <Truck size={16}/>, text: 'Free delivery on orders above ₹999' },
                { icon: <Shield size={16}/>, text: '100% secure & encrypted checkout' },
                { icon: <Package size={16}/>, text: 'Easy 30-day returns' },
              ].map(({ icon, text }) => (
                <div key={text} className="perk-item">
                  <span className="perk-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section">
            <h2>You Might Also Like</h2>
            <div className="related-grid">
              {related.map(p => (
                <Link key={p.id} to={`/products/${p.slug}`} className="related-card">
                  <img src={p.image_url} alt={p.name} />
                  <div className="related-info">
                    <span>{p.name}</span>
                    <strong>₹{Number(p.effective_price).toLocaleString('en-IN')}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
