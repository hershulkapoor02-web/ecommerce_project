import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();

  const rating = (4 + (product.id % 10) * 0.1).toFixed(1);
  const reviews = 40 + (product.id * 17) % 200;

  return (
    <div className="product-card">
      <Link to={`/products/${product.slug}`} className="card-image-wrap">
        {product.discount_percent > 0 && (
          <span className="discount-badge">-{product.discount_percent}%</span>
        )}
        <img
          src={product.image_url || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="card-image"
        />
        <div className="card-overlay">
          <span>Quick View</span>
        </div>
      </Link>

      <div className="card-body">
        <span className="card-category">{product.category_name}</span>
        <Link to={`/products/${product.slug}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>

        <div className="card-rating">
          <Star size={13} fill="var(--gold)" stroke="var(--gold)" />
          <span className="rating-val">{rating}</span>
          <span className="rating-count">({reviews})</span>
        </div>

        <div className="card-footer">
          <div className="card-price">
            <span className="price-current">₹{Number(product.effective_price).toLocaleString('en-IN')}</span>
            {product.sale_price && (
              <span className="price-old">₹{Number(product.price).toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            className="add-btn"
            onClick={() => addToCart(product.id)}
            disabled={loading || product.stock === 0}
          >
            <ShoppingCart size={15} />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
