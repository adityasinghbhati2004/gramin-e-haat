import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

const Navbar = ({ cartCount, onSearch, user, onLogout }) => {

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span style={{ fontSize: '1.8rem' }}>🌾</span>
          Gramin E-Haat
        </Link>
        
        <div className="navbar-links" style={{ marginRight: 'auto', marginLeft: '20px', gap: '12px' }}>
          <Link to="/about" className="nav-text">About</Link>
          <Link to="/contact" className="nav-text">Contact</Link>
        </div>

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
          {user ? (
            <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: '6px 12px' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
