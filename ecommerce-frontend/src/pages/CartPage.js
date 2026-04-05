import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Discover amazing products and add them to your cart</p>
        <Link to="/products" className="btn-primary">
          <ShoppingBag size={18}/> Start Shopping
        </Link>
      </div>
    );
  }

  const shipping = cart.total >= 999 ? 0 : 79;
  const grandTotal = cart.total + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span>({cart.item_count} item{cart.item_count !== 1 ? 's' : ''})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.product.slug}`} className="item-image">
                  <img src={item.product.image_url} alt={item.product.name} />
                </Link>
                <div className="item-details">
                  <span className="item-category">{item.product.category_name}</span>
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="item-name">{item.product.name}</h3>
                  </Link>
                  <div className="item-price-row">
                    <span className="item-price">₹{Number(item.product.effective_price).toLocaleString('en-IN')}</span>
                    {item.product.sale_price && (
                      <span className="item-orig">₹{Number(item.product.price).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
                <div className="item-qty">
                  <button onClick={() => updateItem(item.id, item.quantity - 1)}>
                    <Minus size={14}/>
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)}>
                    <Plus size={14}/>
                  </button>
                </div>
                <div className="item-subtotal">
                  ₹{Number(item.subtotal).toLocaleString('en-IN')}
                </div>
                <button className="item-remove" onClick={() => removeItem(item.id)}>
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cart.item_count} items)</span>
                <span>₹{Number(cart.total).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="shipping-hint">
                  Add ₹{(999 - cart.total).toFixed(0)} more for free shipping
                </p>
              )}
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{Number(grandTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={18}/>
            </button>
            <Link to="/products" className="continue-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
