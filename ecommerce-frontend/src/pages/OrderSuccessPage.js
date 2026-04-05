import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Package, MapPin, Mail } from 'lucide-react';
import './OrderSuccessPage.css';

const API = `${process.env.REACT_APP_API_URL}/api`;

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`${API}/orders/${orderId}/`).then(r => setOrder(r.data));
  }, [orderId]);

  return (
    <div className="success-page container">
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle size={56} />
        </div>
        <h1>Order Confirmed!</h1>
        <p className="success-sub">Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="order-id-badge">Order #{orderId}</div>

        {order && (
          <div className="order-details">
            <div className="detail-row">
              <Mail size={16}/>
              <span>Confirmation sent to <strong>{order.email}</strong></span>
            </div>
            <div className="detail-row">
              <MapPin size={16}/>
              <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
            </div>
            <div className="detail-row">
              <Package size={16}/>
              <span>Estimated delivery: 2–5 business days</span>
            </div>
          </div>
        )}

        {order && (
          <div className="order-items-list">
            <h3>Items Ordered</h3>
            {order.items.map(item => (
              <div key={item.id} className="success-item">
                <span className="si-name">{item.product_name}</span>
                <span className="si-qty">×{item.quantity}</span>
                <span className="si-price">₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="success-total">
              <span>Total Paid</span>
              <strong>₹{Number(order.total_amount).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
          <Link to={`/track-order?id=${orderId}`} className="btn-ghost">Track This Order</Link>
          <Link to="/" className="btn-ghost">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
