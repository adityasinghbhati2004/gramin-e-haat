import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { fetchProducts, loginUser, signupUser, createOrder } from './api';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Router>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {isCartOpen && <div id="overlay" style={{display: 'block'}} onClick={() => setIsCartOpen(false)}></div>}

      <div className="navbar glass">
        <div className="logo"><Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>✨ E-Haat</Link></div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          {user ? (
            <>
              <Link to="/profile">Profile ({user.name})</Link>
              <a onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</a>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </div>

      <Routes>
        <Route path="/" element={
          <div className="section active">
            <div className="hero">
              <h1>Shop Desi.<br/>Feel Global.</h1>
              <p>Discover unique handmade products from rural India.</p>
              <Link to="/shop"><button className="btn-glow">Explore Now ✨</button></Link>
            </div>
          </div>
        } />
        
        <Route path="/shop" element={
          <div className="section active">
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
        } />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/checkout" element={<Checkout cart={cart} total={cartTotal} user={user} clearCart={() => setCart([])} />} />
        <Route path="/profile" element={
          <div className="section active" style={{textAlign: 'center', color: '#fff', paddingTop: '100px'}}>
            <h2>Welcome, {user?.name}!</h2>
            <p>Your orders will appear here soon.</p>
          </div>
        } />
      </Routes>

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
            <span>₹{cartTotal}</span>
          </div>
          <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
            <button className="btn-glow" style={{width: '100%'}}>Checkout 🚀</button>
          </Link>
        </div>
      </div>
    </Router>
  );
}

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const u = await loginUser(email, password);
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      navigate('/');
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="section active" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div className="card glass" style={{width: '400px', padding: '40px'}}>
        <h2 style={{color: 'white', marginBottom: '20px', textAlign: 'center'}}>Welcome Back 👋</h2>
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{padding: '12px', borderRadius: '10px', border: 'none'}} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{padding: '12px', borderRadius: '10px', border: 'none'}} required />
          <button type="submit" className="btn-glow">Login</button>
        </form>
        <p style={{color: 'white', textAlign: 'center', marginTop: '15px'}}>Don't have an account? <Link to="/signup" style={{color: '#a78bfa'}}>Sign up</Link></p>
      </div>
    </div>
  );
}

function Signup({ setUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const u = await signupUser(formData);
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      navigate('/');
    } catch (err) {
      alert('Signup failed.');
    }
  };

  return (
    <div className="section active" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div className="card glass" style={{width: '400px', padding: '40px'}}>
        <h2 style={{color: 'white', marginBottom: '20px', textAlign: 'center'}}>Join E-Haat ✨</h2>
        <form onSubmit={handleSignup} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input type="text" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} style={{padding: '12px', borderRadius: '10px', border: 'none'}} required />
          <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} style={{padding: '12px', borderRadius: '10px', border: 'none'}} required />
          <input type="text" placeholder="Phone" onChange={e => setFormData({...formData, phone: e.target.value})} style={{padding: '12px', borderRadius: '10px', border: 'none'}} required />
          <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} style={{padding: '12px', borderRadius: '10px', border: 'none'}} required />
          <button type="submit" className="btn-glow">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

function Checkout({ cart, total, user, clearCart }) {
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user) {
      alert("Please login first to checkout!");
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    setStatus('processing');
    try {
      // Simulate Payment Gateway Delay
      setTimeout(async () => {
        await createOrder({ userId: user.id, totalAmount: total, paymentMethod: 'MOCK_GATEWAY', shippingAddress: user.address || 'Default Address' });
        setStatus('success');
        clearCart();
        setTimeout(() => navigate('/profile'), 2000);
      }, 2000);
    } catch (e) {
      setStatus('idle');
      alert("Payment failed!");
    }
  };

  return (
    <div className="section active" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
      <div className="card glass" style={{width: '450px', padding: '40px', textAlign: 'center'}}>
        <h2 style={{color: 'white', marginBottom: '20px'}}>Secure Checkout 🔒</h2>
        <div style={{color: 'white', marginBottom: '20px', textAlign: 'left'}}>
          <p>Total Items: <b>{cart.length}</b></p>
          <h3 style={{color: '#10b981', marginTop: '10px'}}>Total Amount: ₹{total}</h3>
        </div>

        {status === 'idle' && (
          <button className="btn-glow" onClick={handlePayment} style={{width: '100%', background: 'linear-gradient(45deg, #10b981, #3b82f6)'}}>
            Pay with UPI / Card (Test Mode)
          </button>
        )}
        
        {status === 'processing' && (
          <div style={{color: 'white'}}>
            <div className="loader" style={{margin: '0 auto 10px auto'}}></div>
            <p>Processing Payment securely...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div style={{color: '#10b981'}}>
            <h2 style={{fontSize: '40px'}}>✅</h2>
            <h3>Payment Successful!</h3>
            <p style={{color: 'white'}}>Redirecting to your profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}
