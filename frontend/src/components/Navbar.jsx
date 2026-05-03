import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

const Navbar = ({ cartCount, onSearch }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span style={{ fontSize: '1.8rem' }}>🌾</span>
          Gramin E-Haat
        </Link>
        
        <div className="navbar-search">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search Amazon, Flipkart & Local..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="navbar-links">
          <Link to="/categories" className="nav-icon" title="Categories">
            <Menu size={24} />
          </Link>
          <Link to="/cart" className="nav-icon" title="Cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/dashboard" className="nav-icon" title="Account">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
