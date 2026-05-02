import { useState, useEffect } from 'react';
import { fetchProducts } from './api';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Fetch products from Spring Boot Backend
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.style.transform = 'scale(1.3)';
      setTimeout(() => cartIcon.style.transform = '', 200);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {isCartOpen && <div id="overlay" style={{display: 'block'}} onClick={() => setIsCartOpen(false)}></div>}

      <div className="navbar glass">
        <div className="logo">✨ E-Haat</div>
        <div className="nav-links">
          <a onClick={() => setActiveSection('home')}>Home</a>
          <a onClick={() => setActiveSection('products')}>Shop</a>
        </div>
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </div>

      {activeSection === 'home' && (
        <div id="home" className="section active">
          <div className="hero">
            <h1>Shop Desi.<br/>Feel Global.</h1>
            <p>Discover unique handmade products from rural India.</p>
            <button className="btn-glow" onClick={() => setActiveSection('products')}>Explore Now ✨</button>
          </div>
        </div>
      )}

      {activeSection === 'products' && (
        <div id="products" className="section active">
          <h2 className="section-title">Fresh Drops 🔥</h2>
          <div className="grid">
            {products.map(product => (
              <div key={product.id} className="card glass">
                <button className="wishlist-btn">🤍</button>
                <div className="card-img-wrapper">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <div className="price-row">
                    <span className="price">₹{product.price}</span>
                  </div>
                  <button className="btn-glow add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="cart" className={`cart ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>❌</button>
        </div>
        <ul className="cart-items">
          {cart.map((item, i) => (
            <li key={i} className="cart-item">
              <div>
                <h4 style={{marginBottom: '5px'}}>{item.name}</h4>
                <span style={{fontWeight: 'bold', color: '#10b981'}}>₹{item.price}</span>
              </div>
              <button onClick={() => removeFromCart(i)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>🗑️</button>
            </li>
          ))}
        </ul>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>₹{cart.reduce((sum, item) => sum + item.price, 0)}</span>
          </div>
          <button className="btn-glow" style={{width: '100%'}}>Checkout 🚀</button>
        </div>
      </div>
    </>
  );
}

export default App;
