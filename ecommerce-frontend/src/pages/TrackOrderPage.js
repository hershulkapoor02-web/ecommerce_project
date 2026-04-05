import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, XCircle, Search, MapPin, Mail, Phone, ShoppingBag } from 'lucide-react';
import './TrackOrderPage.css';

const API = 'http://localhost:8000/api';

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: <Clock size={20}/>,        desc: 'Your order has been received' },
  { key: 'processing', label: 'Processing',    icon: <Package size={20}/>,      desc: 'We are preparing your items' },
  { key: 'shipped',    label: 'Shipped',       icon: <Truck size={20}/>,        desc: 'Your order is on the way' },
  { key: 'delivered',  label: 'Delivered',     icon: <CheckCircle size={20}/>,  desc: 'Order delivered successfully' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);
    try {
      const { data } = await axios.get(`${API}/orders/${orderId.trim()}/`);
      setOrder(data);
    } catch {
      setError('No order found with this ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_ORDER.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="track-page">
      <div className="container">

        <div className="track-header">
          <h1>Track Your Order</h1>
          <p>Enter your Order ID to see real-time status updates</p>
        </div>

        <div className="track-search-wrap">
          <form className="track-search-form" onSubmit={handleTrack}>
            <div className="track-input-wrap">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g. 1, 2, 3...)"
                className="track-input"
              />
            </div>
            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? 'Searching…' : 'Track Order'}
            </button>
          </form>
        </div>

        {searched && error && !loading && (
          <div className="track-error">
            <XCircle size={40} />
            <h3>Order Not Found</h3>
            <p>{error}</p>
            <p className="track-hint">💡 You can find your Order ID on the order confirmation page after placing an order.</p>
          </div>
        )}

        {order && !loading && (
          <div className="track-result fade-in-up">

            <div className="track-meta-bar">
              <div className="meta-item">
                <span className="meta-label">Order ID</span>
                <span className="meta-value">#{order.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Placed On</span>
                <span className="meta-value">{formatDate(order.created_at)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Total Amount</span>
                <span className="meta-value">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className={`status-pill status-${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {!isCancelled ? (
              <div className="progress-section">
                <h2>Order Progress</h2>
                <div className="progress-track">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step.key} className={`progress-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                        <div className="step-connector-wrap">
                          {i > 0 && <div className={`step-line ${i <= currentStep ? 'filled' : ''}`} />}
                          <div className="step-circle">
                            {done ? <CheckCircle size={22} /> : step.icon}
                          </div>
                        </div>
                        <div className="step-info">
                          <span className="step-label">{step.label}</span>
                          <span className="step-desc">{step.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="cancelled-banner">
                <XCircle size={32} />
                <div>
                  <h3>Order Cancelled</h3>
                  <p>This order has been cancelled.</p>
                </div>
              </div>
            )}

            <div className="track-details-grid">

              <div className="track-card">
                <h3>Delivery Details</h3>
                <div className="delivery-info">
                  <div className="delivery-row">
                    <div className="delivery-icon"><Package size={16}/></div>
                    <div>
                      <span className="di-label">Recipient</span>
                      <span className="di-value">{order.full_name}</span>
                    </div>
                  </div>
                  <div className="delivery-row">
                    <div className="delivery-icon"><Mail size={16}/></div>
                    <div>
                      <span className="di-label">Email</span>
                      <span className="di-value">{order.email}</span>
                    </div>
                  </div>
                  <div className="delivery-row">
                    <div className="delivery-icon"><Phone size={16}/></div>
                    <div>
                      <span className="di-label">Phone</span>
                      <span className="di-value">{order.phone}</span>
                    </div>
                  </div>
                  <div className="delivery-row">
                    <div className="delivery-icon"><MapPin size={16}/></div>
                    <div>
                      <span className="di-label">Address</span>
                      <span className="di-value">
                        {order.address}, {order.city},<br/>
                        {order.state} - {order.pincode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="track-card">
                <h3>Items Ordered ({order.items.length})</h3>
                <div className="track-items">
                  {order.items.map(item => (
                    <div key={item.id} className="track-item">
                      <div className="ti-icon"><ShoppingBag size={16}/></div>
                      <div className="ti-info">
                        <span className="ti-name">{item.product_name}</span>
                        <span className="ti-qty">Qty: {item.quantity}  ×  ₹{Number(item.price).toLocaleString('en-IN')}</span>
                      </div>
                      <span className="ti-total">₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="track-order-total">
                    <span>Total Paid</span>
                    <strong>₹{Number(order.total_amount).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="track-actions">
              <Link to="/products" className="track-shop-btn">Continue Shopping</Link>
              <button className="track-new-btn" onClick={() => { setOrder(null); setOrderId(''); setSearched(false); }}>
                Track Another Order
              </button>
            </div>

          </div>
        )}

        {!searched && !order && (
          <div className="track-empty">
            <div className="track-empty-icon">📦</div>
            <h3>Enter your Order ID above</h3>
            <p>You can find your Order ID in the confirmation page after placing an order.</p>
            <div className="track-tip">
              <strong>💡 Tip:</strong> Just placed an order? Your Order ID is shown on the success page (e.g. Order #3)
            </div>
          </div>
        )}

      </div>
    </div>
  );
}