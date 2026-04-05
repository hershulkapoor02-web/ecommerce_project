import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cart } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">Elara</span>
        </Link>

        <div className="nav-links">
          <Link to="/products">All Products</Link>
          <Link to="/products?category=electronics">Electronics</Link>
          <Link to="/products?category=fashion">Fashion</Link>
          <Link to="/products?category=home-living">Home</Link>
          <Link to="/track-order">Track Order</Link>
        </div>

        <div className="nav-actions">
          <form className="search-form" onSubmit={handleSearch}>
            <Search size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
            />
          </form>
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            {cart.item_count > 0 && <span className="cart-badge">{cart.item_count}</span>}
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/products" onClick={() => setMenuOpen(false)}>All Products</Link>
          <Link to="/products?category=electronics" onClick={() => setMenuOpen(false)}>Electronics</Link>
          <Link to="/products?category=fashion" onClick={() => setMenuOpen(false)}>Fashion</Link>
          <Link to="/products?category=home-living" onClick={() => setMenuOpen(false)}>Home & Living</Link>
          <Link to="/products?category=books" onClick={() => setMenuOpen(false)}>Books</Link>
          <Link to="/products?category=sports" onClick={() => setMenuOpen(false)}>Sports</Link>
          <form className="mobile-search" onSubmit={handleSearch}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" />
            <button type="submit"><Search size={16}/></button>
          </form>
        </div>
      )}
    </nav>
  );
}
