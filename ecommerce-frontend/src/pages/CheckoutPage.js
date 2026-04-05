import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const API = 'http://localhost:8000/api';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: ''
  });
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.pincode.trim() || form.pincode.length < 6) e.pincode = 'Valid pincode required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    const sk = localStorage.getItem('cart_session') || '';
    try {
      const { data } = await axios.post(`${API}/orders/`, form, {
        headers: sk ? { 'X-Cart-Session': sk } : {}
      });
      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally { setSubmitting(false); }
  };

  const shipping = cart.total >= 999 ? 0 : 79;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Contact Details</h2>
              <div className="form-row">
                <div className="field">
                  <label>Full Name *</label>
                  <input value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Rahul Sharma" className={errors.full_name ? 'error' : ''} />
                  {errors.full_name && <span className="field-error">{errors.full_name}</span>}
                </div>
                <div className="field">
                  <label>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="rahul@example.com" className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="field">
                <label>Phone Number *</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" className={errors.phone ? 'error' : ''} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-section">
              <h2>Delivery Address</h2>
              <div className="field">
                <label>Street Address *</label>
                <textarea value={form.address} onChange={e => update('address', e.target.value)} placeholder="Flat/House No, Street Name, Locality" rows={3} className={errors.address ? 'error' : ''} />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="field">
                  <label>City *</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Kolkata" className={errors.city ? 'error' : ''} />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="field">
                  <label>State *</label>
                  <input value={form.state} onChange={e => update('state', e.target.value)} placeholder="West Bengal" className={errors.state ? 'error' : ''} />
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>
                <div className="field">
                  <label>Pincode *</label>
                  <input value={form.pincode} onChange={e => update('pincode', e.target.value)} placeholder="700001" className={errors.pincode ? 'error' : ''} />
                  {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            <div className="form-section payment-info">
              <h2>Payment</h2>
              <div className="payment-badge">
                <span>💳</span> Cash on Delivery (COD)
              </div>
              <p className="payment-note">Pay when your order arrives at your doorstep.</p>
            </div>

            <button type="submit" className="place-order-btn" disabled={submitting || cart.items.length === 0}>
              {submitting ? 'Placing Order…' : `Place Order — ₹${Number(cart.total + shipping).toLocaleString('en-IN')}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="checkout-summary">
            <h2>Your Order ({cart.item_count} items)</h2>
            <div className="checkout-items">
              {cart.items.map(item => (
                <div key={item.id} className="co-item">
                  <div className="co-img">
                    <img src={item.product.image_url} alt={item.product.name} />
                    <span className="co-qty">{item.quantity}</span>
                  </div>
                  <div className="co-info">
                    <span>{item.product.name}</span>
                  </div>
                  <span className="co-price">₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="co-totals">
              <div className="co-row"><span>Subtotal</span><span>₹{Number(cart.total).toLocaleString('en-IN')}</span></div>
              <div className="co-row"><span>Shipping</span><span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="co-row co-total"><span>Total</span><span>₹{Number(cart.total + shipping).toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
